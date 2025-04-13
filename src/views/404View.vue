<template>
  <div class="not-found-container">
    <h1>404</h1>
    <div class="glitch-wrapper">
      <div class="glitch" data-text="Page Not Found">Page Not Found</div>
    </div>
    <p>The page you are looking for doesn't exist or has been moved.</p>
    <router-link to="/" class="home-button">
      Return to Home
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  console.log('404 page accessed for path:', router.currentRoute.value.path);
});
</script>

<style scoped lang="scss">
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  text-align: center;
  padding: 0 20px;

  h1 {
    font-size: 8rem;
    margin-bottom: 0;
    color: var(--color-primary, #333);
  }

  p {
    margin: 2rem 0;
    font-size: 1.2rem;
    max-width: 500px;
  }

  .home-button {
    padding: 10px 20px;
    background-color: var(--color-primary, #333);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: var(--color-secondary, #555);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
  }

  .glitch-wrapper {
    margin-bottom: 1rem;
  }
  
  .glitch {
    font-size: 2rem;
    font-weight: bold;
    position: relative;
    color: var(--color-primary, #333);
    
    &::before,
    &::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: white;
    }
    
    &::before {
      left: 2px;
      text-shadow: -2px 0 var(--color-secondary, red);
      animation: glitch-anim-1 2s infinite linear alternate-reverse;
      clip: rect(24px, 550px, 90px, 0);
    }
    
    &::after {
      left: -2px;
      text-shadow: -2px 0 var(--color-tertiary, blue);
      animation: glitch-anim-2 3s infinite linear alternate-reverse;
      clip: rect(85px, 550px, 140px, 0);
    }
  }

  @keyframes glitch-anim-1 {
    0% { clip: rect(52px, 9999px, 39px, 0); }
    10% { clip: rect(25px, 9999px, 102px, 0); }
    20% { clip: rect(33px, 9999px, 27px, 0); }
    30% { clip: rect(24px, 9999px, 97px, 0); }
    40% { clip: rect(68px, 9999px, 176px, 0); }
    50% { clip: rect(153px, 9999px, 178px, 0); }
    60% { clip: rect(113px, 9999px, 90px, 0); }
    70% { clip: rect(71px, 9999px, 7px, 0); }
    80% { clip: rect(55px, 9999px, 143px, 0); }
    90% { clip: rect(126px, 9999px, 99px, 0); }
    100% { clip: rect(21px, 9999px, 28px, 0); }
  }

  @keyframes glitch-anim-2 {
    0% { clip: rect(34px, 9999px, 185px, 0); }
    10% { clip: rect(101px, 9999px, 91px, 0); }
    20% { clip: rect(19px, 9999px, 36px, 0); }
    30% { clip: rect(143px, 9999px, 64px, 0); }
    40% { clip: rect(30px, 9999px, 50px, 0); }
    50% { clip: rect(13px, 9999px, 25px, 0); }
    60% { clip: rect(199px, 9999px, 4px, 0); }
    70% { clip: rect(73px, 9999px, 20px, 0); }
    80% { clip: rect(156px, 9999px, 187px, 0); }
    90% { clip: rect(100px, 9999px, 107px, 0); }
    100% { clip: rect(99px, 9999px, 113px, 0); }
  }
}

@media (max-width: 768px) {
  .not-found-container {
    h1 {
      font-size: 5rem;
    }
    
    .glitch {
      font-size: 1.5rem;
    }
  }
}
</style>