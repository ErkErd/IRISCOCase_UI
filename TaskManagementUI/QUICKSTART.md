# Quick Start Guide

## 🚀 Setup (2 dakika)

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Development server'ı başlat
npm run dev
```

Uygulama `http://localhost:3000` adresinde açılacak.

## ⚙️ Backend Bağlantısı

### 1. Backend URL'ini ayarla

`vite.config.ts` dosyasında:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:5000',  // Backend port'unu buraya yaz
    changeOrigin: true,
  },
}
```

### 2. Backend API Endpoints

Backend'iniz şu endpoint'leri sağlamalı:

```
GET    /api/tasks              # Tüm taskları getir
POST   /api/tasks              # Yeni task oluştur
PUT    /api/tasks/{id}         # Task güncelle
DELETE /api/tasks/{id}         # Task sil
PUT    /api/tasks/{id}/status  # Status güncelle
```

### 3. Response Format

```json
{
  "data": [
    {
      "id": "1",
      "title": "Task başlığı",
      "description": "Açıklama",
      "status": "ToDo",
      "dueDate": "2025-12-31"
    }
  ],
  "totalCount": 50,
  "page": 1,
  "pageSize": 10,
  "totalPages": 5
}
```

## 📁 Klasör Yapısı

```
src/
├── api/          → API konfigürasyonu
├── components/   → React componentleri
├── context/      → State management
├── models/       → TypeScript tipleri
├── pages/        → Sayfalar
├── services/     → API servisleri
└── utils/        → Yardımcı fonksiyonlar
```

## 🔧 Önemli Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `src/api/endpoints.ts` | API endpoint tanımları |
| `src/services/Task.service.ts` | Task API çağrıları |
| `src/context/TaskContext.tsx` | Global state |
| `src/models/Task.model.ts` | Task tipleri |
| `vite.config.ts` | Backend proxy ayarı |

## 💡 Hızlı Kullanım

### Yeni Task Oluştur
1. "New Task" butonuna tıkla
2. Form'u doldur
3. "Create Task" butonuna tıkla

### Task Düzenle
1. Task card'ındaki "Edit" butonuna tıkla
2. Değişiklikleri yap
3. "Update Task" butonuna tıkla

### Task Sil
1. "Delete" butonuna tıkla
2. Silme işlemini onayla

### Filtreleme
- **Search**: Başlık veya açıklamaya göre ara
- **Status Filter**: Dropdown'dan status seç

## 🐛 Sorun Giderme

**Backend'e bağlanamıyor:**
```bash
# 1. Backend'in çalıştığını kontrol et
# 2. vite.config.ts'deki proxy ayarını kontrol et
# 3. Browser console'da network hatalarına bak
```

**Port 3000 kullanımda:**
```typescript
// vite.config.ts
server: { port: 3001 }
```

**TypeScript hataları:**
```bash
# node_modules'ü sil ve tekrar yükle
rm -rf node_modules
npm install
```

## 📝 Komutlar

```bash
npm run dev       # Dev server başlat
npm run build     # Production build
npm run preview   # Build'i önizle
npm run lint      # Kod kalitesi kontrolü
```

## 🎯 Sonraki Adımlar

1. ✅ Backend API'yi bağla
2. ✅ Task oluştur/düzenle/sil işlemlerini test et
3. ✅ Filtreleme ve arama özelliklerini dene
4. ✅ Responsive tasarımı mobilde test et

---

**Daha fazla bilgi için README.md dosyasına bakın.**
