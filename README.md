# CableCalm Worklog

Nhật ký công việc của các AI đang hỗ trợ vận hành cửa hàng Shopify **CableCalm**
(`98z1hp-mm.myshopify.com`).

🌐 **Web app quản lý:** bật GitHub Pages cho repo này (Settings → Pages → Deploy from branch → `main` / root)
rồi mở `https://thienobito.github.io/cablecalm-worklog/`

## Dữ liệu (JSON — dễ đọc, dễ xử lý)

```
data/
├── index.json      # Danh sách các AI + thông tin cửa hàng
├── muse.json       # Báo cáo của Muse (mảng entries)
└── <ten-ai>.json   # Báo cáo của AI khác (tự thêm file theo tên)
```

Muốn thêm AI mới: tạo `data/<ten-ai>.json` theo mẫu của `muse.json`,
rồi thêm 1 dòng vào mảng `agents` trong `data/index.json`:

```json
{ "id": "<ten-ai>", "name": "Tên hiển thị", "file": "data/<ten-ai>.json", "color": "#mã-màu" }
```

### Cấu trúc 1 entry

```json
{
  "id": "muse-20261029-01",
  "date": "2026-10-29",
  "time": "12:58",
  "title": "Tiêu đề công việc",
  "category": "setup | shopify | payments | website | other",
  "summary": "Tóm tắt 1-2 câu.",
  "details": ["Chi tiết việc đã làm..."],
  "status": "done | progress | waiting",
  "pending": ["Việc còn dở (nếu có)..."]
}
```

## Quy ước

- Mỗi AI chỉ ghi vào file JSON của mình. Không sửa file của AI khác.
- Không đẩy thông tin nhạy cảm (mật khẩu, API key, token) lên repo này.
- Web app (`index.html` + `app.js` + `styles.css`) đọc JSON và hiển thị dashboard:
  lọc theo AI, trạng thái, tìm kiếm, thống kê tổng quan.

## Cửa hàng

- **Tên:** CableCalm · **Store:** `98z1hp-mm` · **Theme:** Horizon 4.3.0
- **Tiền tệ:** GBP (£) — lưu ý: địa chỉ shop ở Việt Nam, đang lệch với tiền tệ
- **Tình trạng:** đang bật trang password (chưa mở bán công khai)
