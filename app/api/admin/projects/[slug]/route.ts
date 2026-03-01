import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { requireAuth } from '../../../../../lib/auth';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'projects');

// 获取单个项目
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // 验证身份
    requireAuth(request);
    
    const { slug } = params;
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
    
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return NextResponse.json({
      slug,
      title: data.title || '',
      description: data.description || '',
      date: data.date || '',
      published: data.published || false,
      url: data.url || '',
      repository: data.repository || '',
      content,
    });
  } catch (error) {
    if (error instanceof Error && error.message === '未授权访问') {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }
    console.error('获取项目失败:', error);
    return NextResponse.json({ error: '项目不存在' }, { status: 404 });
  }
}

// 更新项目
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // 验证身份
    requireAuth(request);
    
    const { slug } = params;
    const data = await request.json();
    const { title, description, content, url, repository, published, date } = data;

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
      message: '项目更新成功' 
    });
  } catch (error) {
    if (error instanceof Error && error.message === '未授权访问') {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }
    console.error('更新项目失败:', error);
    return NextResponse.json({ error: '更新项目失败' }, { status: 500 });
  }
}

// 删除项目
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // 验证身份
    requireAuth(request);
    
    const { slug } = params;
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
    
    await fs.unlink(filePath);

    return NextResponse.json({ 
      success: true, 
      message: '项目删除成功' 
    });
  } catch (error) {
    if (error instanceof Error && error.message === '未授权访问') {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }
    console.error('删除项目失败:', error);
    return NextResponse.json({ error: '删除项目失败' }, { status: 500 });
  }
}