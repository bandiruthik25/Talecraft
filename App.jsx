import { useState } from "react";
import jsPDF from "jspdf";

function App() {
  const [title, setTitle] = useState("");
  const [chapters, setChapters] = useState([{ text: "", image: null }]);

  const addChapter = () => {
    setChapters([...chapters, { text: "", image: null }]);
  };

  const updateChapter = (index, field, value) => {
    const newChapters = [...chapters];
    newChapters[index][field] = value;
    setChapters(newChapters);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(title || "Untitled Story", 10, 20);
    let y = 30;

    chapters.forEach((chapter, i) => {
      doc.setFontSize(14);
      doc.text(`Chapter ${i + 1}`, 10, y);
      y += 10;
      doc.setFontSize(12);

      const textLines = doc.splitTextToSize(chapter.text, 180);
      textLines.forEach((line) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 10, y);
        y += 8;
      });

      if (chapter.image) {
        doc.addPage();
        doc.addImage(chapter.image, "JPEG", 15, 40, 180, 120);
        y = 170;
      } else {
        y += 10;
      }
    });

    doc.save(`${title || "TaleCraft"}.pdf`);
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>📖 TaleCraft</h1>
      <input
        placeholder="Enter your story title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 20 }}
      />

      {chapters.map((ch, index) => (
        <div key={index} style={{ marginBottom: 30 }}>
          <h3>Chapter {index + 1}</h3>
          <textarea
            value={ch.text}
            onChange={(e) => updateChapter(index, "text", e.target.value)}
            placeholder="Write your chapter..."
            style={{ width: "100%", height: 120, padding: 10 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  updateChapter(index, "image", reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
            style={{ marginTop: 10 }}
          />
          {ch.image && (
            <div style={{ marginTop: 10 }}>
              <img src={ch.image} alt="Chapter" width="100%" />
            </div>
          )}
        </div>
      ))}

      <button onClick={addChapter} style={{ padding: 10, marginRight: 10 }}>
        ➕ Add Chapter
      </button>
      <button onClick={exportToPDF} style={{ padding: 10 }}>
        📥 Export Book as PDF
      </button>
    </div>
  );
}

export default App;