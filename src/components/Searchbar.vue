<template>
  <div class="flex-1 min-w-[200px]">
    <input
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full border border-slate-300 rounded0lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: 'Search...',
  },
})

defineEmits(['update:modelValue'])
</script>
