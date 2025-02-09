# V-translate Docs

## File SRC:
```sh
./src/config/directive/v-translate.ts
```

## Purpose
This v-translate is a personalized vue directive, you use this on fixed texts of the application, instead of use the `t` from the i18-next.

## How to use?
Here is a common example on application:

```html
<p v-translate>
    Test paragraph
</p>
```

## Possible Bugs

### Button

If you need to use dynamic texts on buttons, for better UX on loading, do not use this:

```html
<Button v-translate @click="yourFunction()" :disabled="isLoading">
    {{ isLoading ? 'Carregando...' : 'Carregar Mais' }}
</Button>
```

This causes a bug that does not show the text update based on the isLoading state.

Instead this, use this:

```tsx
import { t } from "i18next";

<Button @click="yourFunction()" :disabled="isLoading">
    {{ isLoading ? t('Carregando...') : t('Carregar Mais') }}
</Button>
```
