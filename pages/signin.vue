<template>
    <v-container
        fluid
        class="d-flex justify-center align-center"
    >
        <v-row>
            <v-col
                cols="12"
            >
                <h1 class="text-2xl font-bold text-center mb-8">Sign In</h1>

                <v-form
                    ref="formRef"
                    v-model="isValid"
                    lazy-validation
                    class="max-w-md mx-auto"
                >
                    <v-text-field
                        v-model="email"
                        label="Email"
                        :rules="emailRules"
                        prepend-inner-icon="mdi-email"
                        type="email"
                        outlined
                        required
                        class="mb-5"
                    />

                    <v-text-field
                        v-model="password"
                        label="Password"
                        :rules="passwordRules"
                        prepend-inner-icon="mdi-lock"
                        type="password"
                        outlined
                        required
                    />

                    <div
                        v-if="store.loginErrorMessage"
                        class="text-red-500 text-sm mt-2"
                    >
                        {{ store.loginErrorMessage }}
                    </div>

                    <div class="d-flex justify-end">
                        <v-btn
                            color="primary"
                            class="mt-10"
                            :disabled="!isValid"
                            @click="submitForm"
                        >
                            Sign In
                        </v-btn>
                    </div>

                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/stores/useStore';

const router = useRouter();
const store = useStore();

const email = ref('');
const password = ref('');
const isValid = ref(false);
const formRef = ref(null);

// Validation rules
const emailRules = [
    (v: string) => !!v || 'Email is required',
    (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
];

const passwordRules = [
    (v: string) => !!v || 'Password is required',
    (v: string) => v.length >= 6 || 'Password must be at least 6 characters long',
];

// Submit form
const submitForm = () => {
    if (formRef.value && formRef.value.validate()) {
        store.login(email.value, password.value).then(() => {
            if (store.isAuthenticated) {
                router.push('/'); // Redirect to main page on successful login
            }
        });
    }
};

onMounted(async () => {
    await store.restoreSession();

    if (store.isAuthenticated) {
        router.push('/');
    }
});

</script>

<style scoped>
.v-container {
    height: 100vh;
}
</style>