# Image Docs

## File SRC:
```sh
./src/tags/Image.vue
```

## Purpose
This Image vue tag is inspired on Next.js, creating an default image component to the application, using her instead of the HTML ``<img />`` tag. </br>
When creating the image, we also created a default loading, based on the image size and rounding, prioritizing UX without the need for any external logic.</br>
In addition, the image requires the passing of parameters that help with accessibility and fast loading, such as: `alt`, `width`, `height` and `loading="lazy"`.

## How to use?
Here is a common example on application:

```html
<Image src="https://..." alt="EnterpriseName logo" width="80" height="80" />
```
