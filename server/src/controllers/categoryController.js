import Category from '../models/Category.js';
import slugify from '../utils/slugify.js';

export const createCategory = async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json(category);
};

export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};
