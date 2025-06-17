<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="q-mb-md flex row justify-between">
      <h2 class="text-primary q-mb-sm flex items-center">📊 Dashboard de Usuários</h2>
      <q-card flat bordered class="text-center inline-block q-pa-md bg-white shadow-2">
        <div class="text-h5 text-weight-bold text-secondary">Total de usuários</div>
        <div class="text-h3 text-primary q-mt-xs">{{ totalUsuarios }}</div>
      </q-card>
    </div>

    <div class="row q-col-gutter-md q-row-gutter-md">
      <div class="col-12 col-md-6">
        <q-card flat bordered class="bg-white shadow-1 q-pa-md">
          <h3 class="text-h6 text-primary q-mb-md">Usuários por Inicial do Nome</h3>
          <MyChart :options="chartInicialPorNome" />
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card flat bordered class="bg-white shadow-1 q-pa-md">
          <h3 class="text-h6 text-primary q-mb-md">Usuários por Faixa de ID</h3>
          <MyChart :options="chartPorFaixaId" />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Ref } from 'vue';
import MyChart from 'components/MyChart.vue';
import type { Options } from 'highcharts';

const chartInicialPorNome: Ref<Options> = ref({});
const chartPorFaixaId: Ref<Options> = ref({});
const totalUsuarios = ref(0);

interface Usuario {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

async function fetchUsers(): Promise<void> {
  try {
    const response = await fetch('https://reqres.in/api/users?page=1', {
      method: 'GET',
      headers: {
        'x-api-key': 'reqres-free-v1',
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    const users: Usuario[] = [...json.data];
    totalUsuarios.value = users.length;

    // Gráfico 1: Inicial do primeiro nome
    const inicialMap: Record<string, number> = {};
    users.forEach((user) => {
      const inicial = user.first_name.charAt(0).toUpperCase();
      inicialMap[inicial] = (inicialMap[inicial] || 0) + 1;
    });

    chartInicialPorNome.value = {
      chart: { type: 'column', backgroundColor: '#f9f9f9' },
      title: { text: '' },
      xAxis: {
        categories: Object.keys(inicialMap),
        title: { text: 'Inicial' },
        labels: { style: { color: '#333', fontWeight: 'bold' } },
      },
      yAxis: {
        min: 0,
        title: { text: 'Quantidade de usuários' },
        labels: { style: { color: '#333' } },
      },
      series: [
        {
          name: 'Usuários',
          type: 'column',
          data: Object.values(inicialMap),
          color: '#1976D2',
        },
      ],
      credits: { enabled: false },
      legend: { enabled: false },
      tooltip: { enabled: true },
    };

    // Gráfico 2: Faixas de ID
    const faixas = {
      '1–4': 0,
      '5–8': 0,
      '9–12': 0,
    };

    users.forEach((user) => {
      if (user.id >= 1 && user.id <= 4) faixas['1–4']++;
      else if (user.id >= 5 && user.id <= 8) faixas['5–8']++;
      else if (user.id >= 9) faixas['9–12']++;
    });

    chartPorFaixaId.value = {
      chart: { type: 'bar', backgroundColor: '#f9f9f9' },
      title: { text: '' },
      xAxis: {
        categories: Object.keys(faixas),
        title: { text: 'Faixa de ID' },
        labels: { style: { color: '#333', fontWeight: 'bold' } },
      },
      yAxis: {
        min: 0,
        title: { text: 'Quantidade de usuários' },
        labels: { style: { color: '#333' } },
      },
      series: [
        {
          name: 'Usuários',
          type: 'bar',
          data: Object.values(faixas),
          color: '#388E3C',
        },
      ],
      credits: { enabled: false },
      legend: { enabled: false },
      tooltip: { enabled: true },
    };
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
  }
}

fetchUsers().catch((e) => {
  console.log(e);
});
</script>
