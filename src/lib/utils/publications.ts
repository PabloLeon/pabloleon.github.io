import type { Publication, PublicationType } from '../types';

// Import the JSON data
import publicationsData from '../assets/myPublications.json';

// Type mapping from BibTeX types to our publication types
const mapPublicationType = (bibType: string): PublicationType => {
  switch (bibType.toLowerCase()) {
    case 'article':
      return 'Journal Article';
    case 'thesis':
      return 'Ph.D. Thesis';
    case 'inproceedings':
      return 'Conference Paper';
    case 'incollection':
      return 'Book Chapter';
    case 'techreport':
    case 'unpublished':
      return 'Preprint';
    default:
      return 'Other';
  }
};

// Parse authors string and convert to array
const parseAuthors = (authorString: string | undefined): string[] => {
  if (!authorString || typeof authorString !== 'string') {
    return ['Unknown Author'];
  }
  
  return authorString
    .split(' and ')
    .map(author => author.trim())
    .filter(author => author.length > 0);
};

// Determine venue from journal, booktitle, publisher, or school for thesis
const getVenue = (item: any): string => {
  // Special handling for thesis entries
  if (item.type === 'thesis' && item.school) {
    return item.school;
  }
  
  return item.journal || item.booktitle || item.publisher || 'Unknown Venue';
};

// Generate DOI URL if DOI exists
const generateUrl = (item: any): string | undefined => {
  if (item.doi) {
    return `https://doi.org/${item.doi}`;
  }
  if (item.url) {
    return item.url;
  }
  return undefined;
};

// Transform the JSON data to match our Publication type
export const transformPublications = (): Publication[] => {
  return publicationsData.map((item: any) => {
    // Add validation for required fields
    if (!item.id || !item.title || !item.year) {
      console.warn('Skipping publication with missing required fields:', item);
      return null;
    }

    const publication: Publication = {
      id: item.id,
      title: item.title,
      authors: parseAuthors(item.author),
      venue: getVenue(item),
      year: parseInt(item.year) || new Date().getFullYear(),
      type: mapPublicationType(item.type || 'Other'),
      status: 'Published' as const,
    };

    // Add optional fields if they exist
    if (item.doi) {
      publication.doi = item.doi;
    }
    
    if (item.abstract) {
      publication.abstract = item.abstract;
    }
    
    if (item.publisher) {
      publication.publisher = item.publisher;
    }
    
    if (item.editor) {
      publication.editor = parseAuthors(item.editor);
    }
    
    if (item.chapter) {
      publication.chapter = item.chapter;
    }
    
    // Add school and note for thesis entries
    if (item.school) {
      publication.school = item.school;
    }
    
    if (item.note) {
      publication.note = item.note;
    }
    
    const url = generateUrl(item);
    if (url) {
      publication.url = url;
    }

    // Only add PDF if it exists in the source data
    if (item.pdf) {
      publication.pdf = item.pdf;
    }

    return publication;
  }).filter((pub): pub is Publication => pub !== null);
};

// Export the transformed publications
export const publications = transformPublications(); 