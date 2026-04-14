"use client";
import { useRef } from "react";

export default function PhotoCapture({ photos = [], onAdd, onRemove, maxPhotos = 5, label = "Photo Lo", hint = "" }) {
  const inputRef = useRef(null);

  const fileToB64 = (file) => {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = e => res(e.target.result.split(",")[1]);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const file of files.slice(0, maxPhotos - photos.length)) {
      const b64 = await fileToB64(file);
      onAdd({ b64, name: file.name, size: file.size });
    }
    e.target.value = "";
  };

  return (
    <div>
      {photos.length > 0 ? (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
          {photos.map((p, i) => (
            <div key={i} style={{ position:"relative", width:80, height:80 }}>
              <img src={`data:image/jpeg;base64,${p.b64}`} alt={`photo ${i+1}`} style={{ width:80, height:80, borderRadius:12, objectFit:"cover", border:"2px solid #ff6b35" }} />
              <button onClick={() => onRemove(i)} style={{ position:"absolute", top:-6, right:-6, width:22, height:22, borderRadius:"50%", background:"#ef4444", border:"none", color:"#fff", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800 }}>✕</button>
            </div>
          ))}
        </div>
      ) : (
        <div onClick={() => inputRef.current?.click()} style={{ border:"2px dashed #ff6b35", borderRadius:18, padding:"28px 16px", textAlign:"center", cursor:"pointer", background:"#ff6b3508", marginBottom:12 }}>
          <div style={{ fontSize:44, marginBottom:8 }}>📸</div>
          <div style={{ fontWeight:800, fontSize:15, marginBottom:4 }}>{label}</div>
          <div style={{ fontSize:13, color:"#64748b", marginBottom:12, lineHeight:1.6 }}>{hint}</div>
          <div style={{ background:"#ff6b35", color:"#fff", borderRadius:10, padding:"10px 20px", display:"inline-block", fontWeight:800, fontSize:14 }}>📷 Camera / Gallery</div>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" capture="environment" multiple style={{ display:"none" }} onChange={handleFileChange} />
    </div>
  );
}