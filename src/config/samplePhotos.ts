export interface SamplePhoto {
  id: string;
  name: string;
  url: string;
  category: 'recents' | 'favorites';
}

export const SAMPLE_PHOTOS: SamplePhoto[] = [
  {
    id: 'sample-cat-orange',
    name: 'Ginger Cat',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    category: 'recents',
  },
  {
    id: 'sample-cat-black',
    name: 'Black Cat Portrait',
    url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
    category: 'recents',
  },
  {
    id: 'sample-cat-white',
    name: 'Fluffy White Cat',
    url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80',
    category: 'recents',
  },
  {
    id: 'sample-cat-yawn',
    name: 'Sleepy Kitty',
    url: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=600&q=80',
    category: 'recents',
  },
  {
    id: 'sample-omurice',
    name: 'Golden Omelette',
    url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    category: 'recents',
  },
  {
    id: 'sample-breakfast',
    name: 'Morning Breakfast',
    url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80',
    category: 'recents',
  },
  {
    id: 'sample-kitten-box',
    name: 'Kitten in Basket',
    url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=600&q=80',
    category: 'favorites',
  },
  {
    id: 'sample-cat-tuxedo',
    name: 'Tuxedo Cat',
    url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80',
    category: 'favorites',
  },
  {
    id: 'sample-sunset-street',
    name: 'Sunset Alley',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    category: 'recents',
  },
  {
    id: 'sample-coffee',
    name: 'Artisan Latte',
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    category: 'favorites',
  },
  {
    id: 'sample-cozy-room',
    name: 'Warm Aesthetic',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    category: 'recents',
  },
  {
    id: 'sample-puppy',
    name: 'Golden Retriever Pup',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    category: 'favorites',
  },
];
