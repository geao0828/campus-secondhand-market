import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// import { userAPI } from '../api'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)
  const favorites = ref([])
  const cart = ref([])

  const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))

  const initFromStorage = () => {
    const saved = localStorage.getItem('campus_user')
    if (saved) {
      try {
        user.value = JSON.parse(saved)
      } catch {
        localStorage.removeItem('campus_user')
      }
    }
    const savedFav = localStorage.getItem('campus_favorites')
    if (savedFav) {
      try {
        favorites.value = JSON.parse(savedFav)
      } catch {
        favorites.value = []
      }
    }
    const savedCart = localStorage.getItem('campus_cart')
    if (savedCart) {
      try {
        cart.value = JSON.parse(savedCart)
      } catch {
        cart.value = []
      }
    }
  }

  const persist = () => {
    if (user.value) {
      localStorage.setItem('campus_user', JSON.stringify(user.value))
    } else {
      localStorage.removeItem('campus_user')
    }
    localStorage.setItem('campus_favorites', JSON.stringify(favorites.value))
    localStorage.setItem('campus_cart', JSON.stringify(cart.value))
  }

  const login = async (userData) => {
    // 对接后端: const res = await userAPI.login(credentials)
    user.value = userData
    localStorage.setItem('token', userData.token || 'mock-token')
    persist()
  }

  const logout = () => {
    user.value = null
    favorites.value = []
    cart.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('campus_user')
    localStorage.removeItem('campus_favorites')
    localStorage.removeItem('campus_cart')
  }

  const updateProfile = (data) => {
    if (user.value) {
      user.value = { ...user.value, ...data }
      persist()
    }
  }

  const addToCart = (product, quantity = 1) => {
    const existItem = cart.value.find((item) => item.product.id === product.id)
    if (existItem) {
      existItem.quantity += quantity
    } else {
      cart.value.push({ product, quantity })
    }
    persist()
  }

  const removeFromCart = (productId) => {
    const index = cart.value.findIndex((item) => item.product.id === productId)
    if (index > -1) cart.value.splice(index, 1)
    persist()
  }

  const updateCartQuantity = (productId, quantity) => {
    const item = cart.value.find((item) => item.product.id === productId)
    if (item) item.quantity = quantity
    persist()
  }

  const clearCart = () => {
    cart.value = []
    persist()
  }

  const addFavorite = (product) => {
    if (!favorites.value.find((f) => f.id === product.id)) {
      favorites.value.push(product)
      persist()
    }
  }

  const removeFavorite = (productId) => {
    const index = favorites.value.findIndex((f) => f.id === productId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      persist()
    }
  }

  const isFavorite = (productId) => favorites.value.some((f) => f.id === productId)

  return {
    user,
    isLoggedIn,
    favorites,
    cart,
    cartCount,
    initFromStorage,
    login,
    logout,
    updateProfile,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addFavorite,
    removeFavorite,
    isFavorite
  }
})
