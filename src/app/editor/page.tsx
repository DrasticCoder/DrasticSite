'use client';
import LiveEditor from '@/components/LiveEditor';
import { useCode } from '@/context/CodeContext';
import Link from 'next/link';
import './editor.css';

export default function EditorPage() {
  const { code } = useCode();

  const handlePublish = async () => {
    const name = prompt('Enter site name:');
    if (name !== null) {
      console.log('Site name:', name);
    }
    if (!name) {
      alert('Please enter a valid site name.');
      return;
    }
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-');

    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: slug, code }),
    });
    if (res.ok) {
      const publishedUrl = `https://${name}.site.drasticcoder.in`;
      window.open(publishedUrl, '_blank');
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div>
          <Link href="/" className="logo">
            DrasticSite
          </Link>
          <h1>HTML Editor</h1>
        </div>
        <button onClick={handlePublish}>Publish</button>
      </div>
      <LiveEditor />
    </div>
  );
}
