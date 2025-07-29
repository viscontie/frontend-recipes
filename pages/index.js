import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("main course");
  const [pdfs, setPdfs] = useState([]);
  const [search, setSearch] = useState("");

const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file || !title) return alert("Please enter a title and select a file.");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("category", category);

  try {
    await axios.post("https://recipes-9s4d.onrender.com/upload-pdf", formData);
    setTitle("");
    fetchPdfs();
  } catch (err) {
    alert(err.response?.data?.detail || "Upload failed.");
  }
};

  const fetchPdfs = async () => {
    const res = await axios.get("https://recipes-9s4d.onrender.com/list-pdfs");
    setPdfs(res.data);
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const filtered = pdfs.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📄 Upload a Recipe PDF</h1>

      <input
        type="text"
        placeholder="Recipe Title"
        className="border p-2 mr-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className="border p-2 mr-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {["main course", "sides", "desserts", "snacks", "soups", "salads", "breakfast", "beverage"].map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <input type="file" accept="application/pdf" onChange={handleUpload} />

      <h2 className="text-2xl font-semibold mt-8">📚 Saved Recipes</h2>
      <input
        type="text"
        placeholder="Search recipes..."
        className="border p-2 mt-2 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="mt-4 space-y-2">
        {filtered.map((pdf, index) => (
          <li key={index}>
            <strong>{pdf.title}</strong> ({pdf.category}) -{" "}
            <a
              href={`https://recipes-9s4d.onrender.com${pdf.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View PDF
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
