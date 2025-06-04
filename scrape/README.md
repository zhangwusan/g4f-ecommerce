# StyleKorean Category and Product Scraper

This Python script scrapes category, subcategory, and product information (including details and reviews) from [StyleKorean.com](https://www.stylekorean.com). It’s designed for structured data extraction and supports pagination, logging, and duplicate filtering.

---

## Features

- Get all main categories and subcategories
- Paginate through product listings
- Extract detailed product data (brand, price, images, instructions, reviews, etc.)
- Save structured data into JSON files
- Log scraping activity to avoid re-fetching

---

## Setup

### 1. Clone the Repository
---

```bash
git clone https://github.com/your-username/stylekorean-scraper.git
cd stylekorean-scraper
```

### 2. Install Requirements
---

```python
pip install -r requirements.txt
```
requirements.txt
```bash
requests
beautifulsoup4
tqdm
```

### 3. Usage
---

All scripts are contained in a single Python file. Here’s a basic flow:

1.	Scrape all subcategories:
```bash
sub_categories = scrape_subcategories("https://www.stylekorean.com")
save_subcategories_to_file(sub_categories)
```
2.	Get all product URLs from a subcategory:
```bash
products = scrape_all_products_from_paginated_category(sub_category_url, headers)
```

3.	Fetch detailed product info:
```bash
html = requests.get(product_url, headers=headers, verify=False).content
soup = BeautifulSoup(html, "html.parser")
product_data = extract_product_data(soup)
```
4.	Save to file:
```bash
with open("product_details.json", "w", encoding="utf-8") as f:
    json.dump(product_data, f, ensure_ascii=False, indent=2)
```

### 4. Logging
---

Each subcategory has its own .log file inside:
```bash
log/product_details/[subcategory_group]/[subcategory_name].log
```

### 5. Status
---

- Subcategory scraping
- Product URL pagination
- Product details extraction
- Logging & data persistence

### 6. Notes
---

- Scraping respects pagination and avoids duplicates via .log files.
- All data is grouped by the subcategory group (e.g., makeup_sub_categories) and subcategory name (e.g., Brush__41_).
- Use tqdm for progress bars while scraping large datasets.
- Avoid hammering the site — insert delays between requests or use time.sleep().

### 7. Contact
---

For questions or support, please contact:

- Developer: `Wusan`
- Email: `zhangwusan1@gmail.com`
- Telegram: `Zhangwusan123_32_1`
