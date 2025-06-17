<template>
  <highcharts :options="options" />
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import type { Options } from 'highcharts';

const { options } = defineProps<{ options: Options }>();
</script>
