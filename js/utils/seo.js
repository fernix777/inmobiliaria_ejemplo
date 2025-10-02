/**
 * SEO utilities and structured data helpers
 */

export class SEO {
  /**
   * Generate JSON-LD structured data for RealEstateAgent
   */
  static generateRealEstateAgentSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      'name': 'De Brasi Propiedades',
      'description': 'Inmobiliaria con más de 30 años de experiencia en Buenos Aires',
      'url': 'https://debrasi.com.ar',
      'logo': 'https://debrasi.com.ar/images/debrasi-isologo-ok.png',
      'image': 'https://debrasi.com.ar/images/slider/1-490-x2.jpg',
      'telephone': '+54-11-XXXX-XXXX',
      'email': 'info@debrasi.com.ar',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Dirección',
        'addressLocality': 'Buenos Aires',
        'addressRegion': 'Buenos Aires',
        'postalCode': 'XXXXX',
        'addressCountry': 'AR'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '-34.603722',
        'longitude': '-58.381592'
      },
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          'opens': '09:00',
          'closes': '18:00'
        }
      ],
      'sameAs': [
        'https://www.facebook.com/debrasi',
        'https://www.instagram.com/debrasi',
        'https://www.linkedin.com/company/debrasi'
      ]
    };
  }

  /**
   * Generate JSON-LD for a property listing
   */
  static generatePropertySchema(property) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': property.title,
      'description': property.description,
      'image': property.image_url,
      'offers': {
        '@type': 'Offer',
        'price': property.price,
        'priceCurrency': property.currency || 'USD',
        'availability': 'https://schema.org/InStock',
        'url': `https://debrasi.com.ar/property-detail.html?id=${property.id}`
      },
      'category': property.property_type,
      'additionalProperty': [
        {
          '@type': 'PropertyValue',
          'name': 'Habitaciones',
          'value': property.bedrooms
        },
        {
          '@type': 'PropertyValue',
          'name': 'Baños',
          'value': property.bathrooms
        },
        {
          '@type': 'PropertyValue',
          'name': 'Superficie',
          'value': `${property.area} m²`
        },
        {
          '@type': 'PropertyValue',
          'name': 'Ubicación',
          'value': property.location
        }
      ]
    };
  }

  /**
   * Generate breadcrumb schema
   */
  static generateBreadcrumbSchema(items) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url
      }))
    };
  }

  /**
   * Inject structured data into page
   */
  static injectStructuredData(schema) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /**
   * Update meta tags dynamically
   */
  static updateMetaTags(meta) {
    // Title
    if (meta.title) {
      document.title = meta.title;
      this.updateMetaTag('og:title', meta.title);
      this.updateMetaTag('twitter:title', meta.title);
    }

    // Description
    if (meta.description) {
      this.updateMetaTag('description', meta.description);
      this.updateMetaTag('og:description', meta.description);
      this.updateMetaTag('twitter:description', meta.description);
    }

    // Image
    if (meta.image) {
      this.updateMetaTag('og:image', meta.image);
      this.updateMetaTag('twitter:image', meta.image);
    }

    // URL
    if (meta.url) {
      this.updateMetaTag('og:url', meta.url);
      this.updateLinkTag('canonical', meta.url);
    }

    // Type
    if (meta.type) {
      this.updateMetaTag('og:type', meta.type);
    }
  }

  /**
   * Update or create meta tag
   */
  static updateMetaTag(name, content) {
    let tag = document.querySelector(`meta[name="${name}"]`) ||
              document.querySelector(`meta[property="${name}"]`);
    
    if (!tag) {
      tag = document.createElement('meta');
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        tag.setAttribute('property', name);
      } else {
        tag.setAttribute('name', name);
      }
      document.head.appendChild(tag);
    }
    
    tag.setAttribute('content', content);
  }

  /**
   * Update or create link tag
   */
  static updateLinkTag(rel, href) {
    let tag = document.querySelector(`link[rel="${rel}"]`);
    
    if (!tag) {
      tag = document.createElement('link');
      tag.setAttribute('rel', rel);
      document.head.appendChild(tag);
    }
    
    tag.setAttribute('href', href);
  }

  /**
   * Generate sitemap entry (for dynamic sitemap generation)
   */
  static generateSitemapEntry(url, lastmod, changefreq = 'weekly', priority = 0.5) {
    return {
      loc: url,
      lastmod: lastmod || new Date().toISOString().split('T')[0],
      changefreq,
      priority
    };
  }

  /**
   * Add hreflang tags for multilingual sites
   */
  static addHreflangTags(languages) {
    languages.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang.code;
      link.href = lang.url;
      document.head.appendChild(link);
    });
  }

  /**
   * Preload critical resources
   */
  static preloadResource(href, as, type = null) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  }

  /**
   * Add FAQ schema
   */
  static generateFAQSchema(faqs) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };
  }
}

export default SEO;
