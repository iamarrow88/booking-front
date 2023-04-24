export default {
    method: {
        logout() {
            this.$emit('loggin', false);
            this.$router.push('/login');
        }
    }
}