import autoestimaData from '../data/autoestima.json'
import rotinaData from '../data/rotina.json'
import digitalDetoxData from '../data/digital_detox.json'
import mindfulnessData from '../data/mindfulness.json'
import relacionamentosData from '../data/relacionamentos.json'
import corpoSaudeData from '../data/corpo_saude.json'
import carreiraData from '../data/carreira.json'
import complianceData from '../data/compliance.json'

export interface Challenge {
  id: string
  categoryId: string
  title: string
  description: string
  points: number
  duration: number
  difficulty: 'facil' | 'dificil'
  category?: string
}

export interface ChallengeCategory {
  id: string
  label: string
  icon: string
  color: string
  description?: string
  area?: string
  easyCount: number
  hardCount: number
  completionRate?: number
}

interface RawCategoryData {
  label: string
  icon: string
  color: string
  facil: Challenge[]
  dificil: Challenge[]
}

class ChallengesDataMock {
  private static categories: ChallengeCategory[] = []
  private static challenges: Challenge[] = []
  private static initialized: boolean = false

  // Initialize from JSON files
  static initialize() {
    if (this.initialized) return

    const categoryMaps: Record<string, RawCategoryData> = {
      autoestima: autoestimaData as unknown,
      rotina: rotinaData as unknown,
      digital_detox: digitalDetoxData as unknown,
      mindfulness: mindfulnessData as unknown,
      relacionamentos: relacionamentosData as unknown,
      corpo_saude: corpoSaudeData as unknown,
      carreira: carreiraData as unknown,
      compliance: complianceData as unknown,
    }

    // Load categories and challenges
    Object.entries(categoryMaps).forEach(([categoryId, data]) => {
      const category: ChallengeCategory = {
        id: categoryId,
        label: data.label,
        icon: data.icon,
        color: data.color,
        easyCount: data.facil?.length || 0,
        hardCount: data.dificil?.length || 0,
        completionRate: Math.floor(Math.random() * 100),
      }
      this.categories.push(category)

      // Add easy challenges
      if (data.facil) {
        this.challenges.push(
          ...data.facil.map(challenge => ({
            ...challenge,
            categoryId,
            difficulty: 'facil' as const,
            points: 10,
          }))
        )
      }

      // Add hard challenges
      if (data.dificil) {
        this.challenges.push(
          ...data.dificil.map(challenge => ({
            ...challenge,
            categoryId,
            difficulty: 'dificil' as const,
            points: 25,
          }))
        )
      }
    })

    // Load from localStorage if available (ONLY if it has valid challenges)
    const stored = localStorage.getItem('zayia_challenges_data')
    if (stored) {
      try {
        const { categories, challenges } = JSON.parse(stored)
        // Only use localStorage if it has challenges with actual data
        if (categories && challenges && challenges.length > 0) {
          this.categories = categories
          this.challenges = challenges
        } else {
          // localStorage is empty/invalid, save current state
          console.log('localStorage data invalid or empty, resetting with loaded data')
          this.save()
        }
      } catch (e) {
        console.error('Failed to load challenges from localStorage:', e)
        // Save current state if localStorage is corrupted
        this.save()
      }
    } else {
      // No localStorage, save current loaded state
      this.save()
    }

    this.initialized = true
  }

  // Save to localStorage
  private static save() {
    localStorage.setItem(
      'zayia_challenges_data',
      JSON.stringify({
        categories: this.categories,
        challenges: this.challenges,
      })
    )
  }

  // Categories CRUD
  static getCategories(): ChallengeCategory[] {
    this.initialize()
    return [...this.categories]
  }

  static getCategoryById(id: string): ChallengeCategory | null {
    this.initialize()
    return this.categories.find(c => c.id === id) || null
  }

  static createCategory(data: Partial<ChallengeCategory>): ChallengeCategory {
    this.initialize()
    const newCategory: ChallengeCategory = {
      id: data.id || `custom_${Date.now()}`,
      label: data.label || 'Nova Categoria',
      icon: data.icon || '📌',
      color: data.color || 'from-gray-400 to-gray-600',
      description: data.description,
      area: data.area,
      easyCount: 0,
      hardCount: 0,
      completionRate: 0,
    }
    this.categories.push(newCategory)
    this.save()
    return newCategory
  }

  static updateCategory(id: string, data: Partial<ChallengeCategory>): boolean {
    this.initialize()
    const index = this.categories.findIndex(c => c.id === id)
    if (index === -1) return false

    this.categories[index] = {
      ...this.categories[index],
      ...data,
      id: this.categories[index].id, // Don't allow changing ID
    }
    this.save()
    return true
  }

  static deleteCategory(id: string): boolean {
    this.initialize()
    const index = this.categories.findIndex(c => c.id === id)
    if (index === -1) return false

    // Remove all challenges in this category
    this.challenges = this.challenges.filter(c => c.categoryId !== id)
    this.categories.splice(index, 1)
    this.save()
    return true
  }

  // Challenges CRUD
  static getChallengesByCategory(
    categoryId: string,
    difficulty?: 'facil' | 'dificil'
  ): Challenge[] {
    this.initialize()
    let filtered = this.challenges.filter(c => c.categoryId === categoryId)
    if (difficulty) {
      filtered = filtered.filter(c => c.difficulty === difficulty)
    }
    return filtered
  }

  static getChallengeById(id: string): Challenge | null {
    this.initialize()
    return this.challenges.find(c => c.id === id) || null
  }

  static createChallenge(data: Partial<Challenge>): Challenge {
    this.initialize()
    const newChallenge: Challenge = {
      id: data.id || `challenge_${Date.now()}`,
      categoryId: data.categoryId || '',
      title: data.title || 'Novo Desafio',
      description: data.description || '',
      points: data.difficulty === 'dificil' ? 25 : 10,
      duration: data.duration || 5,
      difficulty: data.difficulty || 'facil',
    }
    this.challenges.push(newChallenge)

    // Update category counts
    const category = this.categories.find(c => c.id === newChallenge.categoryId)
    if (category) {
      if (newChallenge.difficulty === 'facil') {
        category.easyCount++
      } else {
        category.hardCount++
      }
    }

    this.save()
    return newChallenge
  }

  static updateChallenge(id: string, data: Partial<Challenge>): boolean {
    this.initialize()
    const index = this.challenges.findIndex(c => c.id === id)
    if (index === -1) return false

    const oldDifficulty = this.challenges[index].difficulty
    const newDifficulty = data.difficulty || oldDifficulty

    // Update category counts if difficulty changed
    if (oldDifficulty !== newDifficulty) {
      const category = this.categories.find(
        c => c.id === this.challenges[index].categoryId
      )
      if (category) {
        if (oldDifficulty === 'facil') {
          category.easyCount--
        } else {
          category.hardCount--
        }

        if (newDifficulty === 'facil') {
          category.easyCount++
        } else {
          category.hardCount++
        }
      }
    }

    this.challenges[index] = {
      ...this.challenges[index],
      ...data,
      id: this.challenges[index].id, // Don't allow changing ID
      points: newDifficulty === 'dificil' ? 25 : 10, // Auto-update points
    }
    this.save()
    return true
  }

  static deleteChallenge(id: string): boolean {
    this.initialize()
    const index = this.challenges.findIndex(c => c.id === id)
    if (index === -1) return false

    const challenge = this.challenges[index]
    const category = this.categories.find(c => c.id === challenge.categoryId)

    if (category) {
      if (challenge.difficulty === 'facil') {
        category.easyCount--
      } else {
        category.hardCount--
      }
    }

    this.challenges.splice(index, 1)
    this.save()
    return true
  }

  // Additional operations
  static getChallengeCount(categoryId: string): { easy: number; hard: number } {
    this.initialize()
    const easy = this.challenges.filter(
      c => c.categoryId === categoryId && c.difficulty === 'facil'
    ).length
    const hard = this.challenges.filter(
      c => c.categoryId === categoryId && c.difficulty === 'dificil'
    ).length
    return { easy, hard }
  }

  static duplicateChallenge(id: string): Challenge | null {
    this.initialize()
    const original = this.getChallengeById(id)
    if (!original) return null

    const copy = this.createChallenge({
      ...original,
      id: `${original.id}_copy_${Date.now()}`,
      title: `${original.title} (cópia)`,
    })
    return copy
  }

  // Search & Filter
  static searchChallenges(
    categoryId: string,
    difficulty: 'facil' | 'dificil' | 'both',
    query: string
  ): Challenge[] {
    this.initialize()
    let filtered = this.challenges.filter(c => c.categoryId === categoryId)

    if (difficulty !== 'both') {
      filtered = filtered.filter(c => c.difficulty === difficulty)
    }

    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        c =>
          c.title.toLowerCase().includes(lowerQuery) ||
          c.description.toLowerCase().includes(lowerQuery)
      )
    }

    return filtered
  }

  // Sort
  static sortChallenges(
    challenges: Challenge[],
    sortBy:
      | 'title-asc'
      | 'title-desc'
      | 'points-asc'
      | 'points-desc'
      | 'duration-asc'
      | 'duration-desc'
      | 'popularity'
  ): Challenge[] {
    const sorted = [...challenges]

    switch (sortBy) {
      case 'title-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'points-asc':
        sorted.sort((a, b) => a.points - b.points)
        break
      case 'points-desc':
        sorted.sort((a, b) => b.points - a.points)
        break
      case 'duration-asc':
        sorted.sort((a, b) => a.duration - b.duration)
        break
      case 'duration-desc':
        sorted.sort((a, b) => b.duration - a.duration)
        break
      case 'popularity':
        // Mock: random popularity
        sorted.sort(() => Math.random() - 0.5)
        break
    }

    return sorted
  }

  // Bulk operations
  static bulkUpdateChallenges(
    challengeIds: string[],
    updates: Partial<Challenge>
  ): boolean {
    this.initialize()
    let success = true

    challengeIds.forEach(id => {
      if (!this.updateChallenge(id, updates)) {
        success = false
      }
    })

    return success
  }

  static bulkDeleteChallenges(challengeIds: string[]): boolean {
    this.initialize()
    let success = true

    challengeIds.forEach(id => {
      if (!this.deleteChallenge(id)) {
        success = false
      }
    })

    return success
  }

  // Helper: Calculate challenge popularity (mock)
  static getChallengePPopularity(): number {
    return Math.floor(Math.random() * 100)
  }

  // ============================================================================
  // USER-FACING CHALLENGES FUNCTIONS
  // ============================================================================

  // Get daily challenges (4 random: 2 easy + 2 hard) - deterministic by date
  static getDailyChallenges(categoryId: string, date: string): Challenge[] {
    this.initialize()
    const allChallenges = this.getChallengesByCategory(categoryId)
    const easyChallenges = allChallenges.filter(c => c.difficulty === 'facil')
    const hardChallenges = allChallenges.filter(c => c.difficulty === 'dificil')

    // Use date as seed for deterministic randomization
    const seed = date.split('-').reduce((acc, part) => acc + parseInt(part), 0)

    // Shuffle with seed
    const shuffleWithSeed = (arr: Challenge[], s: number) => {
      const sorted = [...arr]
      for (let i = sorted.length - 1; i > 0; i--) {
        const j = Math.floor((s + i) % (i + 1))
        ;[sorted[i], sorted[j]] = [sorted[j], sorted[i]]
      }
      return sorted
    }

    const shuffledEasy = shuffleWithSeed(easyChallenges, seed)
    const shuffledHard = shuffleWithSeed(hardChallenges, seed + 1000)

    return [
      shuffledEasy[0],
      shuffledEasy[1],
      shuffledHard[0],
      shuffledHard[1],
    ].filter(Boolean)
  }

  // Get active category for user
  static getActiveCategory(userId: string): string | null {
    this.initialize()
    try {
      const userData = localStorage.getItem(`zayia_user_challenges_${userId}`)
      if (userData) {
        const parsed = JSON.parse(userData)
        return parsed.activeCategory || null
      }
    } catch (e) {
      console.error('Error loading user challenges:', e)
    }
    return null
  }

  // Set active category (only once per category, but can change categories)
  static setActiveCategory(userId: string, categoryId: string): boolean {
    this.initialize()
    try {
      const userDataStr = localStorage.getItem(`zayia_user_challenges_${userId}`)
      let userData = userDataStr ? JSON.parse(userDataStr) : null

      // Se usuário já tem dados, atualizar para nova categoria
      // Mas MANTER o totalCompleted (desafios globais)
      if (userData) {
        userData.activeCategory = categoryId
        userData.completedChallenges = [] // Reset para nova categoria
        // Mantém totalCompleted para medalhas globais
      } else {
        // Novo usuário
        userData = {
          activeCategory: categoryId,
          completedChallenges: [],
          totalCompleted: 0, // Inicializar contador global
          completionDate: null,
        }
      }

      localStorage.setItem(`zayia_user_challenges_${userId}`, JSON.stringify(userData))
      return true
    } catch (e) {
      console.error('Error setting active category:', e)
      return false
    }
  }

  // Get completed challenges for user in category
  static getUserCompletedChallenges(categoryId: string, userId: string): string[] {
    this.initialize()
    try {
      const userData = localStorage.getItem(`zayia_user_challenges_${userId}`)
      if (userData) {
        const parsed = JSON.parse(userData)
        if (parsed.activeCategory === categoryId) {
          return parsed.completedChallenges || []
        }
      }
    } catch (e) {
      console.error('Error loading completed challenges:', e)
    }
    return []
  }

  // Get TOTAL completed challenges across ALL categories (for global medals)
  static getTotalChallengesCompleted(userId: string): number {
    this.initialize()
    try {
      const userData = localStorage.getItem(`zayia_user_challenges_${userId}`)
      if (userData) {
        const parsed = JSON.parse(userData)
        // Retorna o totalCompleted que é incrementado sempre que completa um desafio
        return parsed.totalCompleted || 0
      }
    } catch (e) {
      console.error('Error loading total completed challenges:', e)
    }
    return 0
  }

  // Mark challenge as completed
  static completeChallenge(challengeId: string, userId: string): boolean {
    this.initialize()
    try {
      const userData = localStorage.getItem(`zayia_user_challenges_${userId}`)
      if (!userData) return false

      const parsed = JSON.parse(userData)
      if (!parsed.completedChallenges.includes(challengeId)) {
        parsed.completedChallenges.push(challengeId)

        // ✅ INCREMENTAR TOTAL GLOBAL DE DESAFIOS
        if (!parsed.totalCompleted) {
          parsed.totalCompleted = 0
        }
        parsed.totalCompleted += 1

        console.log(`🌍 Total de desafios completados: ${parsed.totalCompleted}`)
      }

      localStorage.setItem(`zayia_user_challenges_${userId}`, JSON.stringify(parsed))
      return true
    } catch (e) {
      console.error('Error completing challenge:', e)
      return false
    }
  }

  // Check if category is completed (all 120 challenges)
  static isCategoryCompleted(categoryId: string, userId: string): boolean {
    this.initialize()
    const completed = this.getUserCompletedChallenges(categoryId, userId)
    const totalChallenges = this.getChallengesByCategory(categoryId).length
    return completed.length === totalChallenges && totalChallenges > 0
  }
}

export default ChallengesDataMock
