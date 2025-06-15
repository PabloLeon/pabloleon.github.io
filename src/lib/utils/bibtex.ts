import type { Publication } from '../types';

// Map publication type back to BibTeX entry type
const mapToBibTeXType = (type: string): string => {
  switch (type) {
    case 'Journal Article':
      return 'article';
    case 'Conference Paper':
      return 'inproceedings';
    case 'Book Chapter':
      return 'incollection';
    case 'Thesis':
      return 'phdthesis';
    case 'Preprint':
      return 'unpublished';
    default:
      return 'misc';
  }
};

// Format authors for BibTeX
const formatAuthors = (authors: string[]): string => {
  return authors.join(' and ');
};

// Generate BibTeX entry for a single publication
export const generateBibTeX = (pub: Publication): string => {
  const type = mapToBibTeXType(pub.type);
  let bibtex = `@${type}{${pub.id},\n`;
  
  // Add required and common fields
  bibtex += `  title={${pub.title}},\n`;
  bibtex += `  author={${formatAuthors(pub.authors)}},\n`;
  bibtex += `  year={${pub.year}},\n`;
  
  // Add venue-specific fields
  if (pub.type === 'Journal Article') {
    bibtex += `  journal={${pub.venue}},\n`;
  } else if (pub.type === 'Conference Paper') {
    bibtex += `  booktitle={${pub.venue}},\n`;
  } else if (pub.type === 'Book Chapter') {
    bibtex += `  booktitle={${pub.venue}},\n`;
  } else {
    bibtex += `  venue={${pub.venue}},\n`;
  }
  
  // Add optional fields
  if (pub.doi) {
    bibtex += `  doi={${pub.doi}},\n`;
  }
  
  if (pub.url) {
    bibtex += `  url={${pub.url}},\n`;
  }
  
  bibtex += '}';
  return bibtex;
};

// Download BibTeX file
export const downloadBibTeX = (pub: Publication): void => {
  const bibtex = generateBibTeX(pub);
  const blob = new Blob([bibtex], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${pub.id}.bib`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate BibTeX for all publications
export const generateAllBibTeX = (publications: Publication[]): string => {
  return publications
    .sort((a, b) => b.year - a.year)
    .map(pub => generateBibTeX(pub))
    .join('\n\n');
};

// Download all publications as BibTeX
export const downloadAllBibTeX = (publications: Publication[]): void => {
  const bibtex = generateAllBibTeX(publications);
  const blob = new Blob([bibtex], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'publications.bib';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 