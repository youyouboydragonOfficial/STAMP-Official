/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Download, Check, Loader2, Image as ImageIcon, X } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { STAMPS, Stamp } from "./constants";
import StampCard from "./components/StampCard";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [activeModal, setActiveModal] = useState<"terms" | "privacy" | null>(null);

  const handleDownloadSingle = async (stamp: Stamp) => {
    try {
      const response = await fetch(stamp.url);
      const blob = await response.blob();
      saveAs(blob, `${stamp.title}.png`);
    } catch (error) {
      console.error("Download failed:", error);
      alert("ダウンロードに失敗しました。別ウィンドウで開いて試してみてください。");
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    setDownloadProgress(0);
    const zip = new JSZip();
    const folder = zip.folder("youyouboy_dragon_Official_Stamps");

    try {
      for (let i = 0; i < STAMPS.length; i++) {
        const stamp = STAMPS[i];
        const response = await fetch(stamp.url);
        const blob = await response.blob();
        folder?.file(`${stamp.title.replace(/\s+/g, "_")}.png`, blob);
        setDownloadProgress(Math.round(((i + 1) / STAMPS.length) * 100));
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "youyouboy_dragon_Official_Stamps.zip");
    } catch (error) {
      console.error("Batch download failed:", error);
      alert("一括ダウンロードに失敗しました。");
    } finally {
      setIsDownloadingAll(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans selection:bg-gray-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white">
              <ImageIcon size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900 leading-none">
                youyouboy_dragon_Official
              </h1>
              <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-widest">
                Official Stamp Gallery
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadAll}
            disabled={isDownloadingAll}
            className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 disabled:bg-gray-400 transition-all shadow-sm active:scale-95"
          >
            {isDownloadingAll ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                {downloadProgress}%
              </>
            ) : (
              <>
                <Download className="mr-2" size={18} />
                一括ダウンロード
              </>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">
                Official Download Site
              </span>
              <h2 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
                LINEスタンプ<br />
                無料ダウンロード公式
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
                youyouboy_dragon_Officialの公式スタンプギャラリーへようこそ。
                お気に入りの画像を個別に、または一括でダウンロードして、
                あなたのチャットを彩りましょう。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
          {STAMPS.map((stamp, index) => (
            <motion.div
              key={stamp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <StampCard stamp={stamp} onDownload={handleDownloadSingle} />
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <p className="text-sm text-gray-400">
            &copy; 2026 youyouboy_dragon_Official. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setActiveModal("terms")}
              className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
            >
              利用規約
            </button>
            <button 
              onClick={() => setActiveModal("privacy")}
              className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
            >
              プライバシーポリシー
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              {activeModal === "terms" ? (
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">利用規約</h3>
                  <div className="space-y-6 text-gray-600 leading-relaxed">
                    <section>
                      <h4 className="font-bold text-gray-900 mb-2">1. 利用規約の適用</h4>
                      <p>本規約は、youyouboy_dragon_Official（以下「当方」）が提供する本サイトの利用条件を定めるものです。本サイトを利用することで、本規約に同意したものとみなされます。</p>
                    </section>
                    <section>
                      <h4 className="font-bold text-gray-900 mb-2">2. 利用目的</h4>
                      <p>本サイトで提供されるスタンプ画像は、個人利用を目的として提供されています。LINEやSNS等での個人的なコミュニケーションにご活用ください。</p>
                    </section>
                    <section>
                      <h4 className="font-bold text-gray-900 mb-2">3. 禁止事項</h4>
                      <p>以下の行為を禁止します：</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>商業目的での利用（販売、広告への使用等）</li>
                        <li>無断転載、再配布、二次配布</li>
                        <li>公序良俗に反する利用、または他者を誹謗中傷する目的での利用</li>
                        <li>当方の著作権を侵害する行為</li>
                      </ul>
                    </section>
                    <section>
                      <h4 className="font-bold text-gray-900 mb-2">4. 免責事項</h4>
                      <p>本サイトの利用により生じた損害やトラブルについて、当方は一切の責任を負いません。また、本サイトの内容は予告なく変更または終了することがあります。</p>
                    </section>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">プライバシーポリシー</h3>
                  <div className="space-y-6 text-gray-600 leading-relaxed">
                    <section>
                      <h4 className="font-bold text-gray-900 mb-2">1. 個人情報の収集</h4>
                      <p>本サイトは、ユーザーの氏名、住所、電話番号などの個人情報を直接収集することはありません。会員登録やログイン機能も備えておりません。</p>
                    </section>
                    <section>
                      <h4 className="font-bold text-gray-900 mb-2">2. 外部サービスの使用</h4>
                      <p>本サイトは画像のホスティングにGoogle Driveを使用しています。Googleのプライバシーポリシーについては、Googleの公式サイトをご確認ください。</p>
                    </section>
                    <section>
                      <h4 className="font-bold text-gray-900 mb-2">3. クッキー（Cookie）について</h4>
                      <p>本サイトが動作するプラットフォームにおいて、セッション管理やセキュリティ向上のためにクッキーが使用される場合があります。これはブラウザの設定で無効にすることが可能ですが、一部の機能が制限される場合があります。</p>
                    </section>
                    <section>
                      <h4 className="font-bold text-gray-900 mb-2">4. お問い合わせ</h4>
                      <p>本ポリシーに関するお問い合わせは、公式SNS等を通じてご連絡ください。</p>
                    </section>
                  </div>
                </div>
              )}
              
              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                >
                  閉じる
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Progress Overlay */}
      <AnimatePresence>
        {isDownloadingAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-6"
          >
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                一括ダウンロード中...
              </h3>
              <p className="text-sm text-gray-500 text-center mb-8">
                画像を圧縮しています。少々お待ちください。
              </p>
              
              <div className="relative h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gray-900"
                  initial={{ width: 0 }}
                  animate={{ width: `${downloadProgress}%` }}
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Progress</span>
                <span>{downloadProgress}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
