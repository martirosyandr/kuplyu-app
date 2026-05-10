"use client";

import { supabase } from "./supabase";
import { useEffect, useState } from "react";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function Home() {
  const tg =
    typeof window !== "undefined"
      ? (window as any).Telegram?.WebApp
      : null;

  const telegramUser = tg?.initDataUnsafe?.user;

  const telegramId =
    telegramUser?.id?.toString();

  const [items, setItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [source_url, setSourceUrl] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    if (!telegramId) return;

    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("telegram_id", telegramId)
      .order("id", { ascending: false });

    if (data) setItems(data);
  }

  async function addItem() {
    if (!title || !brand) return;

    await supabase.from("items").insert({
      telegram_id: telegramId,
      title,
      brand,
      price,
      category,
      image,
      source_url,
    });

    resetForm();
    fetchItems();
    setShowForm(false);
  }

  async function updateItem(id: number) {
    await supabase
      .from("items")
      .update({
        title,
        brand,
        price,
        category,
        image,
        source_url,
      })
      .eq("id", id)
      .eq("telegram_id", telegramId);

    resetForm();
    setEditingId(null);
    fetchItems();
    setShowForm(false);
  }

  async function deleteItem(id: number) {
    await supabase
      .from("items")
      .delete()
      .eq("id", id)
      .eq("telegram_id", telegramId);

    fetchItems();
  }

  function resetForm() {
    setTitle("");
    setBrand("");
    setPrice("");
    setCategory("");
    setImage("");
    setSourceUrl("");
  }

  return (
    <main
      className={`${grotesk.className} bg-[#050505] text-white min-h-screen overflow-hidden relative`}
    >
      {/* GRAIN */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_0.8px,transparent_0.8px)] [background-size:10px_10px]" />

      {/* GRADIENT */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%)] pointer-events-none" />

      {/* GRID */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.06]">
        <div className="absolute left-1/3 top-0 w-px h-full bg-white" />
        <div className="absolute left-2/3 top-0 w-px h-full bg-white" />
      </div>

      {/* HEADER */}
      <div className="border-b border-white/10">
        <div className="px-5 md:px-10 pt-8 md:pt-14 pb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div>
              <h1 className="text-[54px] md:text-[120px] font-bold leading-[0.85] tracking-[-0.09em]">
                КУПЛЮ
              </h1>

              <div
                className={`${mono.className} mt-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-neutral-500`}
              >
                private fashion archive
              </div>

              <button
                onClick={() => setShowCatalog(true)}
                className={`${mono.className} mt-10 text-[11px] uppercase tracking-[0.35em] text-neutral-500 hover:text-white transition`}
              >
                Catalog
              </button>
            </div>

            <div className="w-full md:w-[320px]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH"
                className={`${mono.className} w-full bg-transparent border-b border-white/20 pb-4 outline-none text-sm tracking-[0.2em] uppercase placeholder:text-neutral-600`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="border-b border-white/10 overflow-x-auto">
        <div className="flex gap-8 px-5 md:px-10 py-5 min-w-max">
          {["default", "cheap", "expensive"].map((type) => (
            <button
              key={type}
              onClick={() => setSort(type)}
              className={`${mono.className} text-[11px] uppercase tracking-[0.2em] transition ${
                sort === type
                  ? "text-white"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              {type === "default"
                ? "Default"
                : type === "cheap"
                ? "Lowest Price"
                : "Highest Price"}
            </button>
          ))}
        </div>
      </div>

      {/* Остальной JSX оставляешь БЕЗ изменений */}
    </main>
  );
}