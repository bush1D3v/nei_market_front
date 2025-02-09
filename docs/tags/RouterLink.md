# Image Docs

## File SRC:
```sh
./src/tags/RouterLink.vue
```

## Purpose
This RouterLink vue tag is inspired on Next.js, creating an default RouterLink component to the application, using her instead of the Vue.js ``<router-link />`` tag. </br>
On this component, i just add some default styles, reusing the tailwind classes and the function cn from de ShadCN.

## How to use?
Here is a common example on application:

```html
<RouterLink :to="breadcrumb.to">
    <span>Texto do RouterLink</span>
</RouterLink>
```
