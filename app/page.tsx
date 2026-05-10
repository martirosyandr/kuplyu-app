"use client";

import { supabase } from "./supabase";
import { useEffect, useState } from "react";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";

const grotesk = Space_Grotesk({
  subsets: ["latin", "cyrillic"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
});

export default function Home() {
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
    const { data } = await supabase
      .from("items")
      .select("*")
      .order("id", { ascending: false });

    if (data) setItems(data);
  }

  async function addItem() {
    if (!title || !brand) return;

    await supabase.from("items").insert({
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
      .eq("id", id);

    resetForm();
    setEditingId(null);
    fetchItems();
    setShowForm(false);
  }

  async function deleteItem(id: number) {
    await supabase.from("items").delete().eq("id", id);

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

      {/* SIDEBAR */}
      {showCatalog && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-xl">
          <div className="w-[92%] md:w-[420px] h-full bg-[#070707] border-r border-white/10 p-6 md:p-10 overflow-y-auto">
            <div className="flex items-center justify-between mb-16">
              <div>
                <div
                  className={`${mono.className} text-[10px] uppercase tracking-[0.35em] text-neutral-500`}
                >
                  Navigation
                </div>

                <h2 className="text-3xl md:text-5xl tracking-[-0.08em] font-bold mt-2">
                  CATALOG
                </h2>
              </div>

              <button
                onClick={() => setShowCatalog(false)}
                className={`${mono.className} text-xs uppercase tracking-[0.25em] text-neutral-500 hover:text-white`}
              >
                Close
              </button>
            </div>

            <div className="space-y-14">
              {/* OUTERWEAR */}
              <div>
                <div
                  className={`${mono.className} text-[10px] uppercase tracking-[0.35em] text-neutral-600 mb-5`}
                >
                  01 OUTERWEAR
                </div>

                <div className="flex flex-col gap-3">
                  {["Пальто", "Куртки", "Блейзеры"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCatalog(false);
                      }}
                      className={`text-left text-2xl md:text-3xl tracking-[-0.06em] transition ${
                        selectedCategory === cat
                          ? "text-white"
                          : "text-neutral-500 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* TOPS */}
              <div>
                <div
                  className={`${mono.className} text-[10px] uppercase tracking-[0.35em] text-neutral-600 mb-5`}
                >
                  02 TOPS
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    "Рубашки",
                    "Поло",
                    "Футболки",
                    "Свитеры",
                    "Кардиганы",
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCatalog(false);
                      }}
                      className={`text-left text-2xl md:text-3xl tracking-[-0.06em] transition ${
                        selectedCategory === cat
                          ? "text-white"
                          : "text-neutral-500 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* BOTTOMS */}
              <div>
                <div
                  className={`${mono.className} text-[10px] uppercase tracking-[0.35em] text-neutral-600 mb-5`}
                >
                  03 BOTTOMS
                </div>

                <div className="flex flex-col gap-3">
                  {["Брюки"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCatalog(false);
                      }}
                      className={`text-left text-2xl md:text-3xl tracking-[-0.06em] transition ${
                        selectedCategory === cat
                          ? "text-white"
                          : "text-neutral-500 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* FOOTWEAR */}
              <div>
                <div
                  className={`${mono.className} text-[10px] uppercase tracking-[0.35em] text-neutral-600 mb-5`}
                >
                  04 FOOTWEAR
                </div>

                <div className="flex flex-col gap-3">
                  {["Кроссовки", "Лоферы"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCatalog(false);
                      }}
                      className={`text-left text-2xl md:text-3xl tracking-[-0.06em] transition ${
                        selectedCategory === cat
                          ? "text-white"
                          : "text-neutral-500 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACCESSORIES */}
              <div>
                <div
                  className={`${mono.className} text-[10px] uppercase tracking-[0.35em] text-neutral-600 mb-5`}
                >
                  05 ACCESSORIES
                </div>

                <div className="flex flex-col gap-3">
                  {["Часы", "Аксессуары"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCatalog(false);
                      }}
                      className={`text-left text-2xl md:text-3xl tracking-[-0.06em] transition ${
                        selectedCategory === cat
                          ? "text-white"
                          : "text-neutral-500 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* ALL */}
              <button
                onClick={() => {
                  setSelectedCategory("Все");
                  setShowCatalog(false);
                }}
                className={`${mono.className} mt-10 text-sm uppercase tracking-[0.3em] text-neutral-500 hover:text-white`}
              >
                Show All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOAT BUTTON */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-5 right-5 md:bottom-10 md:right-10 z-50 w-14 h-14 border border-white/20 bg-black/60 backdrop-blur-xl hover:bg-white hover:text-black transition"
      >
        +
      </button>

      {/* FORM */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-end md:items-center justify-center p-4">
          <div className="w-full max-w-3xl border border-white/10 bg-[#0b0b0b]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 className="text-2xl tracking-[-0.08em] font-bold">
                {editingId ? "EDIT ITEM" : "ADD ITEM"}
              </h2>

              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="text-neutral-500 hover:text-white transition"
              >
                CLOSE
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {[
                {
                  value: title,
                  set: setTitle,
                  placeholder: "TITLE",
                },
                {
                  value: brand,
                  set: setBrand,
                  placeholder: "BRAND",
                },
                {
                  value: price,
                  set: setPrice,
                  placeholder: "PRICE",
                },
                {
                  value: category,
                  set: setCategory,
                  placeholder: "CATEGORY",
                },
                {
                  value: image,
                  set: setImage,
                  placeholder: "IMAGE URL",
                },
                {
                  value: source_url,
                  set: setSourceUrl,
                  placeholder: "SOURCE URL",
                },
              ].map((field, i) => (
                <input
                  key={i}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  placeholder={field.placeholder}
                  className={`${mono.className} bg-transparent border-b border-r border-white/10 px-6 py-6 outline-none text-sm uppercase tracking-[0.15em] placeholder:text-neutral-600`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                if (editingId) {
                  updateItem(editingId);
                } else {
                  addItem();
                }
              }}
              className={`${mono.className} w-full py-6 uppercase tracking-[0.2em] border-t border-white/10 hover:bg-white hover:text-black transition`}
            >
              {editingId ? "SAVE" : "ADD ITEM"}
            </button>
          </div>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 border-t border-white/10">
        {items
          .filter((item) => {
            const matchesCategory =
              selectedCategory === "Все" ||
              item.category === selectedCategory;

            const matchesSearch =
              item.title
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
              item.brand
                ?.toLowerCase()
                .includes(search.toLowerCase());

            return matchesCategory && matchesSearch;
          })
          .sort((a, b) => {
            const priceA = parseInt(
              a.price?.replace(/\D/g, "") || "0"
            );

            const priceB = parseInt(
              b.price?.replace(/\D/g, "") || "0"
            );

            if (sort === "cheap") return priceA - priceB;

            if (sort === "expensive") return priceB - priceA;

            return 0;
          })
          .map((item) => (
            <div
              key={item.id}
              className="group border-r border-b border-white/10 relative bg-[#050505]"
            >
              {/* ACTIONS */}
              <div className="absolute top-3 left-3 right-3 z-20 flex justify-between">
                <button
                  onClick={() => {
                    setEditingId(item.id);

                    setTitle(item.title || "");
                    setBrand(item.brand || "");
                    setPrice(item.price || "");
                    setCategory(item.category || "");
                    setImage(item.image || "");
                    setSourceUrl(item.source_url || "");

                    setShowForm(true);
                  }}
                  className={`${mono.className} text-[10px] tracking-[0.2em] text-white/70 hover:text-white`}
                >
                  EDIT
                </button>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-white/60 hover:text-red-500 transition"
                >
                  ×
                </button>
              </div>

              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* IMAGE */}
                <div className="aspect-[3/4] overflow-hidden bg-[#0b0b0b]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition duration-1000 ease-out"
                  />
                </div>

                {/* INFO */}
                <div className="p-4 md:p-6">
                  <div
                    className={`${mono.className} text-[10px] uppercase tracking-[0.22em] text-neutral-500 mb-4`}
                  >
                    {item.brand}
                  </div>

                  <h2 className="text-sm md:text-lg leading-[1.05] tracking-[-0.06em] uppercase max-w-[90%]">
                    {item.title}
                  </h2>

                  <div className="flex items-end justify-between mt-8">
                    <div>
                      <div
                        className={`${mono.className} text-[10px] uppercase tracking-[0.18em] text-neutral-600`}
                      >
                        Category
                      </div>

                      <div className="text-xs text-neutral-300 mt-1">
                        {item.category}
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`${mono.className} text-[10px] uppercase tracking-[0.18em] text-neutral-600`}
                      >
                        Price
                      </div>

                      <div className="text-sm md:text-base mt-1">
                        {item.price}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
      </div>
    </main>
  );
}