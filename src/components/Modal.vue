<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
  >
    <div
      class="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
    >
      <div
        class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50"
      >
        <h3 class="text-xl font-bold text-slate-800">{{ title }}</h3>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 transition-colors text-2xl"
        >
          &times;
        </button>
      </div>

      <div class="p-6">
        <slot></slot>
      </div>

      <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium transition-colors"
        >
          Batal
        </button>
        <button
          @click="$emit('confirm')"
          class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all shadow-md active:scale-95"
        >
          Simpan Data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
})
defineEmits(['close', 'confirm'])
</script>
