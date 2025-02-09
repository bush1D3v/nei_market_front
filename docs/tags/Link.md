# Image Docs

## File SRC:
```sh
./src/tags/Link.vue
```

## Purpose
This Link vue tag is inspired on Next.js, creating an default link component to the application, using her instead of the HTML ``<a />`` tag. </br>
On this component, i added a default rel value if use the prop target = _blank, some default styles reusing the tailwind classes and the function cn from de ShadCN.

## How to use?
Here is a common example on application:

```html
<Link href="https://..." target="_blank">
    <p>Texto do Link</p>
</Link>
```
