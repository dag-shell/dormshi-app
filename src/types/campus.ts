export interface Campus {
  id: string;
  name: string; // Used in header: "Main", "IoT", "Harar", "Vet", "Agri"
  title: string; // Campus title in the list: "Main Campus", "Institute of Technology (IoT)", etc.
  univCode: string; // "HRU"
  univName: string; // "Haramaya University"
}

export const defaultCampuses: Campus[] = [
  {
    id: 'hru-main',
    name: 'Main',
    title: 'Main Campus',
    univCode: 'HRU',
    univName: 'Haramaya University'
  },
  {
    id: 'hru-iot',
    name: 'IoT',
    title: 'Institute of Technology (IoT)',
    univCode: 'HRU',
    univName: 'Haramaya University'
  },
  {
    id: 'hru-chms',
    name: 'Harar',
    title: 'College of Health & Medical Sciences',
    univCode: 'HRU',
    univName: 'Haramaya University'
  },
  {
    id: 'hru-vet',
    name: 'Vet',
    title: 'College of Veterinary Medicine',
    univCode: 'HRU',
    univName: 'Haramaya University'
  },
  {
    id: 'hru-agri',
    name: 'Agri',
    title: 'College of Agriculture',
    univCode: 'HRU',
    univName: 'Haramaya University'
  }
];
