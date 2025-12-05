'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DocumentList } from '@/components/DocumentList';
import { ChatInterface } from '@/components/ChatInterface';
import { GRADIENTS, BORDERS } from '@/lib/theme';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen relative p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <header className={`flex items-center justify-between pb-6 border-b ${BORDERS.primary}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${GRADIENTS.primary} rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/50 ring-1 ring-purple-400/30`}>
              CA
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${GRADIENTS.primaryText}`}>
                CodeAid
              </h1>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Upload & Documents */}
          <div className="lg:col-span-4 space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-4 text-purple-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Files
              </h2>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4 text-purple-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documents
              </h2>
              <DocumentList refreshTrigger={refreshTrigger} />
            </section>
          </div>

          {/* Right Column: Chat Interface */}
          <div className="lg:col-span-8">
            <section className="h-full">
              <h2 className="text-lg font-semibold mb-4 text-purple-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Assistant
              </h2>
              <ChatInterface />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
