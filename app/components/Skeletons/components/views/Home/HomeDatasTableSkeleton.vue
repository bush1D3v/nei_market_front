<template>
  <div class="animate-pulse w-full h-fit mt-2">
    <div class="flex flex-col gap-2">
        <div class="flex justify-between w-full h-6 mb-3">
            <div class="h-3 bg-gray-300 rounded col-span-1 w-8 md:w-16" />
            <div class="h-3 bg-gray-300 rounded col-span-1 w-8 md:w-16" />
            <div class="h-3 bg-gray-300 rounded col-span-1 w-8 md:w-16" />
            <div class="h-3 bg-gray-300 rounded col-span-1 w-8 md:w-16" />
            <div class="h-3 bg-gray-300 rounded col-span-1 w-8 md:w-16" />
        </div>
        <div class="h-[1px] bg-gray-300 rounded col-span-1 w-full mb-4" />
    </div>
    <div v-for="i in 10" :key="i" class="flex flex-col">
        <div class="flex justify-between w-full h-5 mb-3">
            <div class="h-4 bg-gray-300 rounded col-span-1 w-12 md:w-20" />
            <div class="h-4 bg-gray-300 rounded col-span-1 w-12 md:w-20" />
            <div class="h-4 bg-gray-300 rounded col-span-1 w-12 md:w-20" />
            <div class="h-4 bg-gray-300 rounded col-span-1 w-12 md:w-20" />
            <div class="h-4 bg-gray-300 rounded col-span-1 w-12 md:w-20" />
        </div>
        <div class="h-[1px] bg-gray-300 rounded col-span-1 w-full mb-4" />
    </div>
  </div>
</template>
