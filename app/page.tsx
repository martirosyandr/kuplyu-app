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

    const { error } = await supabase
      .from("items")
      .insert({
        title,
        brand,
        price,
        category,
        image,
        source_url,
      });

    if (!error) {
      resetForm();
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
      <div className="border-b border-neutral-800 px-6 py-5 sticky top-0 bg-black z-50 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            КУПЛЮ
          </h1>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск"
            className="bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-sm outline-none w-56"
          />
        </div>
      </div>

      <div className="p-6 border-b border-neutral-900">
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
              }}
              className="bg-neutral-900 border border-neutral-800 px-5 py-3 rounded-xl font-medium"
            >
              Отмена
            </button>
          )}
        </div>
      </div>

      <div className="px-6 py-4 border-b border-neutral-900 flex gap-3 overflow-x-auto">
        <button
          onClick={() => setSort("default")}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            sort === "default"
              ? "bg-white text-black"
              : "bg-neutral-900 text-white"
          }`}
        >
          По умолчанию
        </button>

        <button
          onClick={() => setSort("cheap")}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            sort === "cheap"
              ? "bg-white text-black"
              : "bg-neutral-900 text-white"
          }`}
        >
          Сначала дешевые
        </button>

        <button
          onClick={() => setSort("expensive")}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            sort === "expensive"
              ? "bg-white text-black"
              : "bg-neutral-900 text-white"
          }`}
        >
          Сначала дорогие
        </button>
      </div>

      <div className="overflow-x-auto border-b border-neutral-900">
        <div className="flex gap-3 px-6 py-4 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                selectedCategory === category
                  ? "bg-white text-black"
                  : "bg-neutral-900 hover:bg-neutral-800 text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
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
              className="relative bg-neutral-950 border border-neutral-900 rounded-3xl overflow-hidden hover:scale-[1.02] transition duration-300"
            >
              <button
                onClick={() => deleteItem(item.id)}
                className="absolute top-3 right-3 z-20 bg-black/70 hover:bg-red-500 transition text-white w-8 h-8 rounded-full"
              >
                ×
              </button>

              <button
                onClick={() => {
                  setEditingId(item.id);

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
                className="absolute top-3 left-3 z-20 bg-black/70 hover:bg-white hover:text-black transition text-white px-3 h-8 rounded-full text-sm"
              >
                Edit
              </button>

              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="aspect-[3/4] bg-neutral-900 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <p className="text-xs text-neutral-500 uppercase mb-1">
                    {item.brand}
                  </p>

                  <h2 className="text-sm font-medium leading-snug">
                    {item.title}
                  </h2>

                  <p className="text-xs text-neutral-400 mt-2">
                    {item.category}
                  </p>

                  <p className="text-sm mt-3 font-semibold">
                    {item.price}
                  </p>
                </div>
              </a>
            </div>
          ))}
      </div>
    </main>
  );
}