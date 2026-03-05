import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { requireAuth } from '../../../../lib/auth';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'projects');

// 获取所有项目列表
export async function GET(request: NextRequest) {
  try {
    // 验证身份
    requireAuth(request);
    
    const files = await fs.readdir(CONTENT_DIR);
    const projects = [];

    for (const file of files) {
      if (file.endsWith('.mdx')) {
        const filePath = path.join(CONTENT_DIR, file);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const { data } = matter(fileContent);
        
        projects.push({
          slug: file.replace('.mdx', ''),
          title: data.title || '',
          description: data.description || '',
          date: data.date || '',
          published: data.published || false,
          url: data.url || '',
          repository: data.repository || '',
        });
      }
    }

    // 按日期排序
    projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(projects);
  } catch (error) {
    if (error instanceof Error && error.message === '未授权访问') {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }
    console.error('获取项目列表失败:', error);
    return NextResponse.json({ error: '获取项目列表失败' }, { status: 500 });
  }
}

// 创建新项目
export async function POST(request: NextRequest) {
  try {
    // 验证身份
    requireAuth(request);
    
    const data = await request.json();
    const { title, description, content, url, repository, published, date } = data;

    // 生成文件名（基于标题）
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // 构建MDX内容
    const frontmatter = {
      title,
      description,
      date,
      published,
      ...(url && { url }),
      ...(repository && { repository }),
    };

    const mdxContent = matter.stringify(content || '', frontmatter);

    // 写入文件
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
    await fs.writeFile(filePath, mdxContent, 'utf8');

    return NextResponse.json({ 
      success: true, 
      slug,
      message: '项目创建成功' 
    });
  } catch (error) {
    if (error instanceof Error && error.message === '未授权访问') {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }
    console.error('创建项目失败:', error);
    return NextResponse.json({ error: '创建项目失败' }, { status: 500 });
  }
}