<template>
  <p>{{ statusText }}</p>
  <table border="1" width="300" align="center" v-table-click="state">
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Age</th>
      <th>Score</th>
    </tr>
    <tr align="center" v-for="(item, index) of state.userList" :key="item.id">
      <td>{{item.id}}</td>
      <td :data-index="index" data-field="name">
        <span>{{item.name}}</span>
      </td>
      <td :data-index="index" data-field="age">
        <span>{{item.age}}</span>
      </td>
      <td :data-index="index" data-field="score">
        <span>{{item.score}}</span>
      </td>
    </tr>
  </table>
</template>

<script setup>
import { io } from 'socket.io-client';
import { reactive, computed } from 'vue';
import vTableClick from './directives/tableClick.js'
  const socket = io('http://localhost:3000');

  const state = reactive({
    userList: [],
    status: false,
    field: '',
    index: -1,
    socket
  });
  const statusText = computed(() => state.status ? 'Someone editing right now...' : '');
  socket.on('loadData', (data) => {
   state.userList = data;
  });

  socket.on('changeStatus', (status) => {
    state.status = status;
  });

  socket.on('changeData', ({ field, index, value }) => {
    if (state.userList[index][field]) {
      state.userList[index][field] = value;
    }
  })

</script>

<style>
  td {
    position: relative;
  }
</style>