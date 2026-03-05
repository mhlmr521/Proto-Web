'use client';

import { useState, useEffect } from 'react';
import '../editor.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEditor, EditorContent as TiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import { useForm } from 'react-hook-form';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Save,
  ArrowLeft
} from 'lucide-react';
import NextLink from 'next/link';
import { AuthProvider, ProtectedRoute } from '../../../components/AuthProvider';

interface ProjectFormData {
  title: string;
  description: string;
  url?: string;
  repository?: string;
  published: boolean;
}

// 创建 lowlight 实例
const lowlight = createLowlight();

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams?.get('slug');
  const isEditing = !!slug;

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProjectFormData>({
    defaultValues: {
      title: '',
      description: '',
      url: '',
      repository: '',
      published: false,
    }
  });

  // 初始化编辑器
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  // 加载现有项目数据
  useEffect(() => {
    if (isEditing && slug) {
      loadProject(slug);
    }
  }, [isEditing, slug]);

  const loadProject = async (projectSlug: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/projects/${projectSlug}`);
      if (response.ok) {
        const project = await response.json();
        setValue('title', project.title);
        setValue('description', project.description);
        setValue('url', project.url || '');
        setValue('repository', project.repository || '');
        setValue('published', project.published);
        setContent(project.content);
        if (editor) {
          editor.commands.setContent(project.content);
        }
      }
    } catch (error) {
      console.error('加载项目失败:', error);
      alert('加载项目失败！');
    } finally {
      setLoading(false);
    }
  };

  // 保存项目
  const onSubmit = async (data: ProjectFormData) => {
    setSaving(true);
    try {
      const projectData = {
        ...data,
        content: content,
        date: new Date().toISOString().split('T')[0],
      };

      const url = isEditing ? `/api/admin/projects/${slug}` : '/api/admin/projects';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        alert(isEditing ? '项目更新成功！' : '项目创建成功！');
        router.push('/admin');
      } else {
        const error = await response.text();
        alert(`保存失败: ${error}`);
      }
    } catch (error) {
      console.error('保存项目失败:', error);
      alert('保存失败！');
    } finally {
      setSaving(false);
    }
  };

  // 编辑器工具栏按钮
  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode; 
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded ${
        isActive 
          ? 'bg-indigo-100 text-indigo-700' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <NextLink
                href="/admin"
                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </NextLink>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? '编辑项目' : '新建项目'}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {isEditing ? '修改现有项目' : '创建一个新的项目'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 基本信息 */}
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">基本信息</h3>
                <p className="mt-1 text-sm text-gray-500">
                  项目的基本信息和元数据
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      标题 *
                    </label>
                    <input
                      type="text"
                      {...register('title')}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="项目标题"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      描述 *
                    </label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="项目描述"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      外部链接 <span className="text-gray-400 font-normal">(选填，留空则自动生成)</span>
                    </label>
                    <input
                      type="url"
                      {...register('url')}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="留空自动生成，或填写外部链接如 https://example.com"
                    />
                    {errors.url && (
                      <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      GitHub仓库
                    </label>
                    <input
                      type="text"
                      {...register('repository')}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="username/repository"
                    />
                  </div>

                  <div className="col-span-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('published')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        发布项目
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 内容编辑器 */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">项目内容</h3>
              
              {/* 工具栏 */}
              {editor && (
                <div className="border border-gray-300 rounded-t-md p-2 bg-gray-50 flex flex-wrap gap-1">
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="粗体"
                  >
                    <Bold className="w-4 h-4" />
                  </ToolbarButton>
                  
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="斜体"
                  >
                    <Italic className="w-4 h-4" />
                  </ToolbarButton>
                  
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="删除线"
                  >
                    <Strikethrough className="w-4 h-4" />
                  </ToolbarButton>
                  
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive('code')}
                    title="行内代码"
                  >
                    <Code className="w-4 h-4" />
                  </ToolbarButton>

                  <div className="w-px h-6 bg-gray-300 mx-1" />

                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="标题1"
                  >
                    <Heading1 className="w-4 h-4" />
                  </ToolbarButton>
                  
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="标题2"
                  >
                    <Heading2 className="w-4 h-4" />
                  </ToolbarButton>
                  
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="标题3"
                  >
                    <Heading3 className="w-4 h-4" />
                  </ToolbarButton>

                  <div className="w-px h-6 bg-gray-300 mx-1" />

                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="无序列表"
                  >
                    <List className="w-4 h-4" />
                  </ToolbarButton>
                  
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="有序列表"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </ToolbarButton>
                  
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="引用"
                  >
                    <Quote className="w-4 h-4" />
                  </ToolbarButton>

                  <div className="w-px h-6 bg-gray-300 mx-1" />

                  <ToolbarButton
                    onClick={() => {
                      const url = window.prompt('请输入链接URL:');
                      if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                      }
                    }}
                    isActive={editor.isActive('link')}
                    title="插入链接"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </ToolbarButton>
                  
                  <ToolbarButton
                    onClick={() => {
                      const url = window.prompt('请输入图片URL:');
                      if (url) {
                        editor.chain().focus().setImage({ src: url }).run();
                      }
                    }}
                    title="插入图片"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </ToolbarButton>
                </div>
              )}

              {/* 编辑器 */}
              <div className="border border-gray-300 border-t-0 rounded-b-md">
                <TiptapEditor editor={editor} />
              </div>
            </div>
          </div>

          {/* 保存按钮 */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? '保存中...' : (isEditing ? '更新项目' : '创建项目')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <EditorContent />
      </ProtectedRoute>
    </AuthProvider>
  );
}