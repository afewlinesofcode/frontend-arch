import { beforeEach, describe, expect, it } from 'vitest'
import LocalStorageAuthGateway from '@auth/infrastructure/local-storage/auth-gateway'
import InvalidCredentialsError from '@auth/application/errors/invalid-credentials-error'
import DuplicateCredentialsError from '@auth/application/errors/duplicate-credentials-error'
import mockStorage, { StorageMock } from '@tests/doubles/mocks/mock-storage'

describe('LocalStorageAuthGateway', function () {
  let storage: StorageMock
  let authGateway: LocalStorageAuthGateway

  beforeEach(function () {
    storage = mockStorage()
    storage.getItem.mockReturnValue(
      JSON.stringify([
        {
          email: 'test1@example.com',
          name: 'Test User 1',
          password: 'securepassword1',
        },
        {
          email: 'test2@example.com',
          name: 'Test User 2',
          password: 'securepassword2',
        },
      ])
    )

    authGateway = new LocalStorageAuthGateway(storage)
  })

  describe('login', function () {
    it('should login with valid credentials', async function () {
      const response = await authGateway.login({
        email: 'test1@example.com',
        password: 'securepassword1',
      })

      expect(response).toEqual({
        user: {
          email: 'test1@example.com',
          name: 'Test User 1',
        },
      })
    })

    it('should throw error with invalid credentials', async function () {
      await expect(
        authGateway.login({
          email: 'test1@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(InvalidCredentialsError)
    })

    it('should throw error for non-existing user', async function () {
      await expect(
        authGateway.login({
          email: 'test111@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(InvalidCredentialsError)
    })
  })

  describe('register', function () {
    it('should register a new user', async function () {
      const response = await authGateway.register({
        email: 'test10@example.com',
        password: 'securepassword10',
        name: 'Test User 10',
      })

      expect(response).toEqual({
        user: {
          email: 'test10@example.com',
          name: 'Test User 10',
        },
      })

      expect(storage.setItem).toHaveBeenCalledWith(
        'auth',
        JSON.stringify([
          {
            email: 'test1@example.com',
            name: 'Test User 1',
            password: 'securepassword1',
          },
          {
            email: 'test2@example.com',
            name: 'Test User 2',
            password: 'securepassword2',
          },
          {
            email: 'test10@example.com',
            name: 'Test User 10',
            password: 'securepassword10',
          },
        ])
      )
    })

    it('should throw error when registering an existing user', async function () {
      await expect(
        authGateway.register({
          email: 'test1@example.com',
          password: 'securepassword',
          name: 'Test User',
        })
      ).rejects.toThrow(DuplicateCredentialsError)
    })
  })
})
