"use client";

import { supabase } from "./supabase";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("id", { ascending: false });

    if (data) {
      setItems(data);
    }

    if (error) {
      console.error(error);
    }
  }

  async function addItem() {
    if (!title || !brand) return;

    const { error } = await supabase.from("items").insert({
      title,
      brand,
      price,
      category,
      image,
      source_url,
    });

    if (!error) {
      resetForm();
      setShowForm(false);
      fetchItems();
    }

    if (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  }

  async function updateItem(id: number) {
    const { error } = await supabase
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

    if (!error) {
      setEditingId(null);
      setShowForm(false);
      resetForm();
      fetchItems();
    }

    if (error) {
      console.error(error);
    }
  }

  async function deleteItem(id: number) {
    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchItems();
    }

    if (error) {
      console.error(error);
    }
  }

  function resetForm() {
    setTitle("");
    setBrand("");
    setPrice("");
    setCategory("");
    setImage("");
    setSourceUrl("");
  }

  const categories = [
    "Все",
    "Пальто",
    "Куртки",
    "Костюмы",
    "Блейзеры",
    "Брюки",
    "Рубашки",
    "Поло",
    "Футболки",
    "Свитеры",
    "Кардиганы",
    "Кроссовки",
    "Лоферы",
    "Часы",
    "Аксессуары",
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-50 border-b border-neutral-900 bg-black/95 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tight whitespace-nowrap">
            КУПЛЮ
          </h1>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск"
            className="w-full max-w-[220px] rounded-full border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm outline-none transition focus:border-neutral-600"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 pb-4 md:px-6 scrollbar-hide">
          <button
            onClick={() => setSort("default")}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
              sort === "default"
                ? "bg-white text-black"
                : "bg-neutral-900 text-white"
            }`}
          >
            По умолчанию
          </button>

          <button
            onClick={() => setSort("cheap")}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
              sort === "cheap"
                ? "bg-white text-black"
                : "bg-neutral-900 text-white"
            }`}
          >
            Дешевые
          </button>

          <button
            onClick={() => setSort("expensive")}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
              sort === "expensive"
                ? "bg-white text-black"
                : "bg-neutral-900 text-white"
            }`}
          >
            Дорогие
          </button>
        </div>

        <div className="overflow-x-auto border-t border-neutral-900">
          <div className="flex gap-2 px-4 py-4 min-w-max md:px-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                  selectedCategory === category
                    ? "bg-white text-black"
                    : "border border-neutral-800 bg-neutral-900 text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="border-b border-neutral-900 p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-5">
            {editingId ? "Редактировать вещь" : "Добавить вещь"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название"
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm outline-none"
            />

            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Бренд"
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm outline-none"
            />

            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Цена"
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm outline-none"
            />

            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Категория"
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm outline-none"
            />

            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Ссылка на фото"
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm outline-none"
            />

            <input
              value={source_url}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="Ссылка на товар"
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm outline-none"
            />
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={() => {
                if (editingId) {
                  updateItem(editingId);
                } else {
                  addItem();
                }
              }}
              className="bg-white text-black px-5 py-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              {editingId ? "Сохранить" : "Добавить"}
            </button>

            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  resetForm();
                  setShowForm(false);
                }}
                className="bg-neutral-900 border border-neutral-800 px-5 py-3 rounded-xl font-medium"
              >
                Отмена
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 p-3 md:grid-cols-3 md:gap-5 md:p-6 xl:grid-cols-4">
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

            if (sort === "cheap") {
              return priceA - priceB;
            }

            if (sort === "expensive") {
              return priceB - priceA;
            }

            return 0;
          })
          .map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-3xl border border-neutral-900 bg-neutral-950 transition duration-300 hover:scale-[1.02]"
            >
              <button
                onClick={() => deleteItem(item.id)}
                className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-black/60 text-sm text-white backdrop-blur transition hover:bg-red-500"
              >
                ×
              </button>

              <button
                onClick={() => {
                  setEditingId(item.id);
                  setShowForm(true);

                  setTitle(item.title || "");
                  setBrand(item.brand || "");
                  setPrice(item.price || "");
                  setCategory(item.category || "");
                  setImage(item.image || "");
                  setSourceUrl(item.source_url || "");

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="absolute top-3 left-3 z-20 rounded-full bg-black/60 px-3 h-8 text-sm text-white backdrop-blur transition hover:bg-white hover:text-black"
              >
                Edit
              </button>

              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="aspect-[3/4] overflow-hidden bg-neutral-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-3 md:p-4">
                  <p className="mb-1 text-xs uppercase text-neutral-500">
                    {item.brand}
                  </p>

                  <h2 className="line-clamp-2 text-sm font-medium leading-snug">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-xs text-neutral-400">
                    {item.category}
                  </p>

                  <p className="mt-3 text-sm font-semibold">
                    {item.price}
                  </p>
                </div>
              </a>
            </div>
          ))}
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl text-black shadow-2xl transition active:scale-95"
      >
        +
      </button>
    </main>
  );
}