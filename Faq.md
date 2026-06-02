# 📖 FAQ – Git Branching Guide

<div style="max-width: 800px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;">

  <div style="margin-bottom: 12px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff; transition: box-shadow 0.2s ease;">
    <details>
      <summary style="padding: 16px 20px; font-weight: 600; font-size: 1rem; color: #1e293b; background: #f8fafc; cursor: pointer; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid transparent; user-select: none; transition: background 0.2s ease, color 0.2s ease; list-style: none;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">▶ 1. Bagaimana cara membuat branch baru?</summary>
      <div style="padding: 20px 24px; background: #ffffff; line-height: 1.7; color: #334155;">
        <ol style="padding-left: 0; list-style: none;">
          <li style="margin-bottom: 16px;">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #6366f1; color: #fff; border-radius: 50%; font-size: 0.8rem; font-weight: 700; margin-right: 8px;">1</span>
            <strong style="color: #0f172a;">Pastikan branch <code style="background: #f1f5f9; padding: 3px 8px; border-radius: 6px; font-size: 0.875rem; color: #dc2626;">staging</code> ada secara lokal</strong>
            <br>Jika belum ada, lakukan fetch dari remote terlebih dahulu:
            <pre style="background: #0f172a; color: #e2e8f0; padding: 16px 20px; border-radius: 10px; overflow-x: auto; font-size: 0.875rem; line-height: 1.6; font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;">git fetch &lt;nama-remote&gt;</pre>
          </li>
          <li style="margin-bottom: 16px;">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #6366f1; color: #fff; border-radius: 50%; font-size: 0.8rem; font-weight: 700; margin-right: 8px;">2</span>
            <strong style="color: #0f172a;">Checkout ke branch <code style="background: #f1f5f9; padding: 3px 8px; border-radius: 6px; font-size: 0.875rem; color: #dc2626;">staging</code> dari remote</strong>
            <pre style="background: #0f172a; color: #e2e8f0; padding: 16px 20px; border-radius: 10px; overflow-x: auto; font-size: 0.875rem; line-height: 1.6; font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;">git checkout -b staging &lt;nama-remote&gt;/staging</pre>
            <span style="color: #64748b; font-size: 0.9rem;">Perintah di atas akan membuat branch <code style="background: #f1f5f9; padding: 3px 8px; border-radius: 6px; font-size: 0.875rem; color: #dc2626;">staging</code> lokal yang melacak <code style="background: #f1f5f9; padding: 3px 8px; border-radius: 6px; font-size: 0.875rem; color: #dc2626;">staging</code> pada remote.</span>
          </li>
          <li style="margin-bottom: 8px;">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #6366f1; color: #fff; border-radius: 50%; font-size: 0.8rem; font-weight: 700; margin-right: 8px;">3</span>
            <strong style="color: #0f172a;">Buat branch baru dari <code style="background: #f1f5f9; padding: 3px 8px; border-radius: 6px; font-size: 0.875rem; color: #dc2626;">staging</code></strong>
            <pre style="background: #0f172a; color: #e2e8f0; padding: 16px 20px; border-radius: 10px; overflow-x: auto; font-size: 0.875rem; line-height: 1.6; font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;">git checkout -b &lt;nama-branch-baru&gt;</pre>
            <span style="color: #64748b; font-size: 0.9rem;">Sekarang Anda berada di branch baru yang berbasiskan <code style="background: #f1f5f9; padding: 3px 8px; border-radius: 6px; font-size: 0.875rem; color: #dc2626;">staging</code>.</span>
          </li>
        </ol>
      </div>
    </details>
  </div>

  <div style="margin-bottom: 12px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff; transition: box-shadow 0.2s ease;">
    <details>
      <summary style="padding: 16px 20px; font-weight: 600; font-size: 1rem; color: #1e293b; background: #f8fafc; cursor: pointer; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid transparent; user-select: none; transition: background 0.2s ease, color 0.2s ease; list-style: none;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">▶ 2. Bagaimana cara mencoba (checkout) branch orang lain?</summary>
      <div style="padding: 20px 24px; background: #ffffff; line-height: 1.7; color: #334155;">
        <ol style="padding-left: 0; list-style: none;">
          <li style="margin-bottom: 16px;">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #6366f1; color: #fff; border-radius: 50%; font-size: 0.8rem; font-weight: 700; margin-right: 8px;">1</span>
            <strong style="color: #0f172a;">Pastikan semua perubahan di branch lokal Anda sudah di-add dan commit</strong>
            <pre style="background: #0f172a; color: #e2e8f0; padding: 16px 20px; border-radius: 10px; overflow-x: auto; font-size: 0.875rem; line-height: 1.6; font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;">git add .
git commit -m "Simpan perubahan sebelum beralih branch"</pre>
          </li>
          <li style="margin-bottom: 16px;">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #6366f1; color: #fff; border-radius: 50%; font-size: 0.8rem; font-weight: 700; margin-right: 8px;">2</span>
            <strong style="color: #0f172a;">Fetch update terbaru dari remote</strong>
            <pre style="background: #0f172a; color: #e2e8f0; padding: 16px 20px; border-radius: 10px; overflow-x: auto; font-size: 0.875rem; line-height: 1.6; font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;">git fetch origin</pre>
          </li>
          <li style="margin-bottom: 8px;">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #6366f1; color: #fff; border-radius: 50%; font-size: 0.8rem; font-weight: 700; margin-right: 8px;">3</span>
            <strong style="color: #0f172a;">Checkout ke branch orang lain</strong>
            <pre style="background: #0f172a; color: #e2e8f0; padding: 16px 20px; border-radius: 10px; overflow-x: auto; font-size: 0.875rem; line-height: 1.6; font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;">git checkout -b &lt;nama-branch&gt; origin/&lt;nama-branch&gt;</pre>
            <span style="color: #64748b; font-size: 0.9rem;">Perintah ini membuat branch lokal <code style="background: #f1f5f9; padding: 3px 8px; border-radius: 6px; font-size: 0.875rem; color: #dc2626;">&lt;nama-branch&gt;</code> yang melacak branch yang sama pada remote <code style="background: #f1f5f9; padding: 3px 8px; border-radius: 6px; font-size: 0.875rem; color: #dc2626;">origin</code>.</span>
          </li>
        </ol>
      </div>
    </details>
  </div>

  <div style="margin-top: 24px; background: linear-gradient(135deg, #fef9c3, #fef3c7); border: 1px solid #fde68a; border-radius: 12px; padding: 20px 24px;">
    <h3 style="margin-top: 0; color: #92400e; font-size: 1.05rem;">💡 Tips Tambahan</h3>
    <ul style="padding-left: 20px; color: #78350f; line-height: 1.7;">
      <li style="margin-bottom: 8px;">Gunakan <code style="background: #fef3c7; padding: 3px 8px; border-radius: 6px; font-size: 0.875rem; color: #b45309;">git branch -vv</code> untuk melihat branch mana yang melacak remote mana.</li>
      <li style="margin-bottom: 8px;">Jika ingin kembali ke branch sebelumnya, cukup jalankan <code style="background: #fef3c7; padding: 3px 8px; border-radius: 6px; font-size: 0.875rem; color: #b45309;">git checkout -</code></li>
      <li style="margin-bottom: 4px;">Untuk menghapus branch lokal yang sudah tidak diperlukan:
        <pre style="background: #0f172a; color: #e2e8f0; padding: 12px 16px; border-radius: 10px; overflow-x: auto; font-size: 0.875rem; line-height: 1.6; font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace; margin-top: 8px;">git branch -d &lt;nama-branch&gt;</pre>
      </li>
    </ul>
  </div>

  <div style="margin-top: 16px; background: #f0f9ff; border: 1px solid #bae6fd; border-left: 4px solid #38bdf8; border-radius: 10px; padding: 16px 20px; color: #0369a1; line-height: 1.6;">
    <strong>📝 Catatan:</strong> Gantilah <code style="background: #e0f2fe; padding: 3px 8px; border-radius: 6px; font-size: 0.875rem; color: #0284c7;">&lt;nama-remote&gt;</code> dengan nama remote Anda (mis. <code style="background: #e0f2fe; padding: 3px 8px; border-radius: 6px; font-size: 0.875rem; color: #0284c7;">origin</code>) dan <code style="background: #e0f2fe; padding: 3px 8px; border-radius: 6px; font-size: 0.875rem; color: #0284c7;">&lt;nama-branch-baru&gt;</code> atau <code style="background: #e0f2fe; padding: 3px 8px; border-radius: 6px; font-size: 0.875rem; color: #0284c7;">&lt;nama-branch&gt;</code> dengan nama branch yang diinginkan.
  </div>

</div>
