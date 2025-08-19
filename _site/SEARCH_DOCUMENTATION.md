# Search Function Documentation

## Overview
Your site now has a fully functional search feature that allows visitors to quickly find content across your portfolio. The search is located in the header navigation bar.

## How to Use the Search

### For Visitors
1. **Locate the search bar** - It's in the top navigation header, next to the theme toggle
2. **Start typing** - Begin typing any search term (minimum 2 characters)
3. **View results** - A dropdown will appear with matching results
4. **Click a result** - Click on any result to navigate to that page
5. **Close results** - Click outside the search area or press `Escape` to close

### Search Examples
- Type "about" → Shows About page
- Type "contact" → Shows Contact page  
- Type "blog" → Shows Blog page
- Type "home" → Shows Home page
- Type "message" → Shows Contact page (keyword match)
- Type "profile" → Shows About page (keyword match)

## Current Searchable Content

| Page | Search Terms |
|------|-------------|
| **Home** | home, main, landing, welcome |
| **About** | about, me, profile, bio, information |
| **Blog** | blog, posts, articles, writing |
| **Contact** | contact, message, email, reach out, get in touch |

## Features

### ✨ Real-time Search
- Results appear instantly as you type
- No page reloads required
- Minimum 2 characters to trigger search

### 🎨 Visual Design
- Clean dropdown interface
- Hover effects on results
- Matches your site's brown/emerald theme
- Dark mode support

### 📱 Responsive
- Works on desktop and mobile
- Search bar adapts to screen size
- Touch-friendly on mobile devices

### ⌨️ Keyboard Support
- `Escape` key closes search results
- `Tab` navigation works properly
- Accessible for screen readers

## How to Add More Searchable Content

### Adding New Pages
To add a new page to the search, edit `script.js` and add to the `searchData` array:

```javascript
{
  title: 'Your Page Title',
  url: '/your-page-url/',
  keywords: 'keyword1, keyword2, keyword3'
}
```

### Adding Blog Posts
To make blog posts searchable, add them to the search data:

```javascript
{
  title: 'My Blog Post Title',
  url: '/blog/my-post/',
  keywords: 'blog, post, topic, related words'
}
```

### Adding Projects
To make portfolio projects searchable:

```javascript
{
  title: 'Project Name',
  url: '/projects/project-name/',
  keywords: 'project, technology, skills, description'
}
```

## Technical Details

### Files Modified
- `script.js` - Search functionality logic
- `styles.css` - Search styling and animations
- `_layouts/default.html` - Search bar HTML structure

### Search Logic
- Case-insensitive matching
- Searches both titles and keywords
- Partial word matching (e.g., "cont" matches "contact")
- Filters results in real-time

### Browser Compatibility
- Works in all modern browsers
- Graceful degradation for older browsers
- No external dependencies required

## Customization Options

### Changing Search Behavior
- **Minimum characters**: Change `query.length < 2` in `script.js`
- **Search delay**: Add debouncing for better performance
- **Result limit**: Add `slice(0, 5)` to limit results

### Styling Customization
- **Colors**: Modify CSS variables in `styles.css`
- **Animations**: Adjust transition timing
- **Layout**: Change dropdown positioning

### Advanced Features
- **Search history**: Store recent searches
- **Search analytics**: Track popular searches
- **Fuzzy matching**: Add typo tolerance
- **Search suggestions**: Add autocomplete

## Troubleshooting

### Common Issues
1. **Search not working**: Check browser console for JavaScript errors
2. **Results not showing**: Verify search data array in `script.js`
3. **Styling issues**: Check CSS for conflicts with other styles
4. **Mobile problems**: Test responsive breakpoints

### Debug Mode
Add this to `script.js` for debugging:

```javascript
console.log('Search query:', query);
console.log('Search results:', results);
```

## File Structure
```
exonglish.github.io/
├── _layouts/
│   └── default.html          # Contains search bar HTML
├── script.js                 # Search functionality
├── styles.css               # Search styling
└── SEARCH_DOCUMENTATION.md  # This file
```

## Quick Reference

### Search Bar Location
- **Desktop**: Top navigation, between nav links and theme toggle
- **Mobile**: Same location, responsive design

### Keyboard Shortcuts
- `Escape` - Close search results
- `Tab` - Navigate through results
- `Enter` - Select highlighted result

### Search Data Structure
```javascript
{
  title: "Page Title",        // Display name
  url: "/page-url/",         // Navigation URL
  keywords: "search, terms"   // Searchable keywords
}
```

The search function is now fully integrated and ready to help visitors navigate your portfolio efficiently!
