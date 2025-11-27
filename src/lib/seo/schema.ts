import {
  ProductSchema,
  ProductOffer,
  BreadcrumbItem,
  FAQItem,
  ArticleSchema,
  LocalBusinessSchema,
} from "./types";

/**
 * Generate Product Schema (JSON-LD)
 */
export function generateProductSchema(
  product: ProductSchema,
  offer?: ProductOffer
): object {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
  };

  if (product.image) {
    schema.image = Array.isArray(product.image)
      ? product.image
      : [product.image];
  }

  if (product.brand) {
    schema.brand = {
      "@type": "Brand",
      name: product.brand,
    };
  }

  if (offer) {
    schema.offers = {
      "@type": "Offer",
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      availability: `https://schema.org/${offer.availability || "InStock"}`,
      url: offer.url,
    };

    if (offer.validFrom) {
      schema.offers.priceValidFrom = offer.validFrom;
    }
    if (offer.validThrough) {
      schema.offers.priceValidUntil = offer.validThrough;
    }
  }

  if (product.aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.aggregateRating.ratingValue,
      reviewCount: product.aggregateRating.reviewCount,
    };
  }

  return schema;
}

/**
 * Generate Offer Schema (JSON-LD)
 */
export function generateOfferSchema(offer: ProductOffer): object {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    price: offer.price,
    priceCurrency: offer.priceCurrency,
    availability: `https://schema.org/${offer.availability || "InStock"}`,
    url: offer.url,
    ...(offer.validFrom && { priceValidFrom: offer.validFrom }),
    ...(offer.validThrough && { priceValidUntil: offer.validThrough }),
  };
}

/**
 * Generate Breadcrumb Schema (JSON-LD)
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItem[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQPage Schema (JSON-LD)
 */
export function generateFAQSchema(faqs: FAQItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Article Schema (JSON-LD)
 */
export function generateArticleSchema(article: ArticleSchema): object {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
  };

  if (article.image) {
    schema.image = Array.isArray(article.image)
      ? article.image
      : [article.image];
  }

  if (article.datePublished) {
    schema.datePublished = article.datePublished;
  }

  if (article.dateModified) {
    schema.dateModified = article.dateModified;
  }

  if (article.author) {
    schema.author = {
      "@type": "Person",
      name: article.author.name,
      ...(article.author.url && { url: article.author.url }),
    };
  }

  if (article.publisher) {
    schema.publisher = {
      "@type": "Organization",
      name: article.publisher.name,
      ...(article.publisher.logo && {
        logo: {
          "@type": "ImageObject",
          url: article.publisher.logo,
        },
      }),
    };
  }

  return schema;
}

/**
 * Generate LocalBusiness Schema (JSON-LD)
 */
export function generateLocalBusinessSchema(
  business: LocalBusinessSchema
): object {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.address.addressLocality,
      addressCountry: business.address.addressCountry,
      ...(business.address.streetAddress && {
        streetAddress: business.address.streetAddress,
      }),
      ...(business.address.addressRegion && {
        addressRegion: business.address.addressRegion,
      }),
      ...(business.address.postalCode && {
        postalCode: business.address.postalCode,
      }),
    },
  };

  if (business.image) {
    schema.image = business.image;
  }

  if (business.geo) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    };
  }

  if (business.telephone) {
    schema.telephone = business.telephone;
  }

  if (business.url) {
    schema.url = business.url;
  }

  if (business.priceRange) {
    schema.priceRange = business.priceRange;
  }

  if (business.openingHours) {
    schema.openingHoursSpecification = business.openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours,
    }));
  }

  return schema;
}

