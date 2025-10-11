"use client";

import React from "react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  description: string;
}

interface CategoryCardProps {
  category: Category;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function CategoryCard({
  category,
  index,
  isSelected,
  onClick,
}: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-6 shadow-md transition-all ${
        isSelected
          ? "bg-indigo-50 border-2 border-indigo-500"
          : "bg-white border-2 border-transparent hover:shadow-lg"
      }`}
    >
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${category.color}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {category.title}
      </h3>
      <p className="text-sm text-gray-600">{category.description}</p>
    </motion.div>
  );
}
