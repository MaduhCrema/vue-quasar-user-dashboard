<template>
  <div class="fullscreen bg-grey-2 flex flex-center">
    <div
      class="q-pa-lg q-gutter-md shadow-2 rounded-borders bg-white"
      style="width: 100%; max-width: 400px"
    >
      <h1 class="text-h5 text-center text-weight-bolder text-primary" color="blue">Login</h1>

      <q-input filled v-model="email" type="email" label="E-mail" />
      <q-input filled v-model="senha" type="password" label="Senha" />
      <q-btn label="Entrar" color="primary" style="width: 340px" @click="verifiedLogin" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Cookies } from 'quasar';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref<string>('');
const senha = ref<string>('');
const erro = ref<string | null>(null);

async function verifiedLogin(): Promise<void> {
  erro.value = null;

  if (!email.value || !senha.value) {
    erro.value = 'Preencha os campos abaixo!';
    return;
  }

  try {
    const response = await fetch('https://reqres.in/api/login', {
      method: 'POST',
      headers: {
        'x-api-key': 'reqres-free-v1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: senha.value,
      }),
    });

    if (!response.ok) {
      throw new Error('Login inválido');
    }

    const data = await response.json();
    Cookies.set('token', data.token); // armazenando token real retornado
    await router.push('/'); // redireciona para o dashboard
  } catch (e) {
    erro.value = 'E-mail ou senha incorreto!';
    console.error(e);
  }
}
</script>
