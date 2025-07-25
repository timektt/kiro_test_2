# Final Integration Report

**Generated:** 2025-07-25T14:27:42.523Z
**Overall Score:** 20/100

## Requirements Validation

❌ **Status:** FAILED

### Output
```
[36mℹ Starting comprehensive requirements validation...[0m
======================================================================
[36mℹ Validating Requirement 1: User Authentication System[0m
[32m✅ Requirement 1: 8/8 checks passed[0m
[36mℹ Validating Requirement 2: Public Landing Page[0m
[33m⚠️ Requirement 2: 4/5 checks passed[0m
[36mℹ Validating Requirement 3: Social Feed System[0m
[32m✅ Requirement 3: 11/11 checks passed[0m
[36mℹ Validating Requirement 4: User Profile Management[0m
[32m✅ Requirement 4: 5/5 checks passed[0m
[36mℹ Validating Requirement 5: Notification System[0m
[32m✅ Requirement 5: 6/6 checks passed[0m
[36mℹ Validating Requirement 6: Admin Dashboard[0m
[33m⚠️ Requirement 6: 7/8 checks passed[0m
[36mℹ Validating Requirement 7: Responsive Design and Theming[0m
[33m⚠️ Requirement 7: 5/6 checks passed[0m
[36mℹ Validating Requirement 8: Performance and Security[0m
[32m✅ Requirement 8: 8/8 checks passed[0m
[36mℹ Validating Requirement 9: Optional Enhanced Features[0m
[36mℹ Requirement 9: 6/7 checks passed (optional features)[0m
[36mℹ Validating Database Schema Completeness[0m
[36mℹ Validating Test Coverage[0m
[36mℹ Validating Deployment Readiness[0m

======================================================================
[36mℹ REQUIREMENTS VALIDATION SUMMARY[0m
======================================================================
[32m✅ ✅ Passed: 83[0m
[33m⚠️ ⚠️  Warnings: 3[0m
[31m❌ ❌ Errors: 1[0m

Warnings:
[33m⚠️ ⚠ Responsive design may not be fully implemented[0m
[33m⚠️ ⚠ Tailwind configuration may be incomplete[0m
[33m⚠️ ⚠ MBTI system may not be fully integrated[0m

Errors:
[31m❌ ✗ Admin role not properly defined in schema[0m

======================================================================
[31m❌ ❌ Requirements validation failed![0m
[31m❌ Please fix the errors above before considering the project complete.[0m

```

## Performance Audit

✅ **Status:** PASSED

### Output
```
[36mℹ Starting comprehensive performance audit...[0m
======================================================================
[36mℹ Auditing Next.js Configuration[0m
[36mℹ Auditing Image Optimization[0m
[36mℹ Auditing Bundle Size[0m
[36mℹ Auditing Database Optimization[0m
[36mℹ Auditing Caching Strategy[0m
[36mℹ Auditing State Management[0m
[36mℹ Auditing Loading States and UX[0m
[36mℹ Auditing Accessibility Performance[0m
[36mℹ Auditing SEO Optimization[0m

======================================================================
[36mℹ PERFORMANCE AUDIT SUMMARY[0m
======================================================================
[32m✅ ✅ Optimizations Found: 29[0m
[33m⚠️ ⚠️  Warnings: 2[0m
[31m❌ ❌ Critical Issues: 0[0m
[35m💡 💡 Suggestions: 6[0m

Warnings:
[33m⚠️ ⚠ Limited ARIA attribute usage found[0m
[33m⚠️ ⚠ Limited metadata configuration found[0m

Suggestions for Improvement:
[35m💡 💡 Consider using dynamic imports for code splitting[0m
[35m💡 💡 Configure tree shaking for better bundle optimization[0m
[35m💡 💡 Consider using React.memo, useMemo, and useCallback to prevent unnecessary re-renders[0m
[35m💡 💡 Consider using React Suspense for better loading UX[0m
[35m💡 💡 Consider implementing keyboard navigation for better accessibility[0m
[35m💡 💡 Consider adding structured data for better SEO[0m

======================================================================
[32m✅ 🎉 Performance audit completed! Score: 94%[0m
[36mℹ Consider addressing warnings and suggestions for optimal performance.[0m

```

## Environment Validation

❌ **Status:** FAILED

## Test Suite

❌ **Status:** FAILED

### Test Errors
```
● Validation Warning:

  Unknown option "moduleNameMapping" with value {"^@/(.*)$": "<rootDir>/src/$1"} was found.
  This is probably a typing mistake. Fixing it will remove this message.

  Configuration Documentation:
  https://jestjs.io/docs/configuration

● Validation Warning:

  Unknown option "moduleNameMapping" with value {"^@/(.*)$": "<rootDir>/src/$1"} was found.
  This is probably a typing mistake. Fixing it will remove this message.

  Configuration Documentation:
  https://jestjs.io/docs/configuration

FAIL src/__tests__/lib/admin-auth.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/lib/admin-auth.test.ts'

    [0m [90m  6 |[39m [90m// Mock dependencies[39m
     [90m  7 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m  8 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m  9 |[39m   prisma[33m:[39m {
     [90m 10 |[39m     user[33m:[39m {
     [90m 11 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/lib/admin-auth.test.ts:8:6)

FAIL src/__tests__/hooks/use-posts.test.ts
  ● Test suite failed to run


      [31mx[0m Expected unicode escape
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-posts.test.ts[0m:236:1]
     [2m236[0m |       expect(mockApiPost).toHaveBeenCalledWith('/api/posts', postData)
     [2m237[0m |       expect(mockFeedStore.addPost).toHaveBeenCalledWith(mockCreatedPost)
     [2m238[0m |       expect(mockUIStore.addToast).toHaveBeenCalledWith({
     [2m239[0m |         type: 'success',\n        title: 'Post created',\n        description: 'Your post has been published successfully.',\n      })\n    })\n\n    it('should handle create post error', async () => {\n      const postData = {\n        content: 'New test post',\n      }\n\n      const errorMessage = 'Failed to create post'\n      mockApiPost.mockRejectedValue(new Error(errorMessage))\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.createPost(postData)\n      })\n\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Error',\n        description: errorMessage,\n      })\n    })\n\n    it('should validate post data before creating', async () => {\n      const invalidPostData = {\n        content: '', // Empty content\n      }\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.createPost(invalidPostData)\n      })\n\n      expect(mockApiPost).not.toHaveBeenCalled()\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Validation Error',\n        description: 'Post content is required.',\n      })\n    })\n  })\n\n  describe('updatePost', () => {\n    it('should update a post successfully', async () => {\n      const postId = 'post-1'\n      const updateData = {\n        content: 'Updated post content',\n      }\n\n      const mockUpdatedPost = {\n        ...mockPosts[0],\n        ...updateData,\n        updatedAt: new Date().toISOString(),\n      }\n\n      const mockResponse = {\n        success: true,\n        post: mockUpdatedPost,\n      }\n\n      mockApiPut.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.updatePost(postId, updateData)\n      })\n\n      expect(mockApiPut).toHaveBeenCalledWith(`/api/posts/${postId}`, updateData)\n      expect(mockFeedStore.updatePost).toHaveBeenCalledWith(mockUpdatedPost)\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'success',\n        title: 'Post updated',\n        description: 'Your post has been updated successfully.',\n      })\n    })\n\n    it('should handle update post error', async () => {\n      const postId = 'post-1'\n      const updateData = { content: 'Updated content' }\n      const errorMessage = 'Failed to update post'\n\n      mockApiPut.mockRejectedValue(new Error(errorMessage))\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.updatePost(postId, updateData)\n      })\n\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Error',\n        description: errorMessage,\n      })\n    })\n  })\n\n  describe('deletePost', () => {\n    it('should delete a post successfully', async () => {\n      const postId = 'post-1'\n      const mockResponse = {\n        success: true,\n        message: 'Post deleted successfully',\n      }\n\n      mockApiDelete.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.deletePost(postId)\n      })\n\n      expect(mockApiDelete).toHaveBeenCalledWith(`/api/posts/${postId}`)\n      expect(mockFeedStore.removePost).toHaveBeenCalledWith(postId)\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'success',\n        title: 'Post deleted',\n        description: 'Your post has been deleted successfully.',\n      })\n    })\n\n    it('should handle delete post error', async () => {\n      const postId = 'post-1'\n      const errorMessage = 'Failed to delete post'\n\n      mockApiDelete.mockRejectedValue(new Error(errorMessage))\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.deletePost(postId)\n      })\n\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Error',\n        description: errorMessage,\n      })\n    })\n  })\n\n  describe('likePost', () => {\n    it('should like a post successfully', async () => {\n      const postId = 'post-1'\n      const mockResponse = {\n        success: true,\n        liked: true,\n      }\n\n      mockApiPost.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.likePost(postId)\n      })\n\n      expect(mockApiPost).toHaveBeenCalledWith(`/api/posts/${postId}/like`)\n      expect(mockFeedStore.addOptimisticUpdate).toHaveBeenCalledWith(postId, {\n        type: 'like',\n        isLiked: true,\n        timestamp: expect.any(Number),\n      })\n    })\n\n    it('should unlike a post successfully', async () => {\n      const postId = 'post-2' // This post is already liked\n      const mockResponse = {\n        success: true,\n        liked: false,\n      }\n\n      mockApiDelete.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.likePost(postId)\n      })\n\n      expect(mockApiDelete).toHaveBeenCalledWith(`/api/posts/${postId}/like`)\n      expect(mockFeedStore.addOptimisticUpdate).toHaveBeenCalledWith(postId, {\n        type: 'like',\n        isLiked: false,\n        timestamp: expect.any(Number),\n      })\n    })\n\n    it('should handle like post error', async () => {\n      const postId = 'post-1'\n      const errorMessage = 'Failed to like post'\n\n      mockApiPost.mockRejectedValue(new Error(errorMessage))\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.likePost(postId)\n      })\n\n      expect(mockFeedStore.removeOptimisticUpdate).toHaveBeenCalledWith(postId)\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Error',\n        description: errorMessage,\n      })\n    })\n  })\n\n  describe('loadMorePosts', () => {\n    it('should load more posts successfully', async () => {\n      const existingPosts = [mockPosts[0]]\n      const newPosts = [mockPosts[1]]\n      \n      mockUseFeedStore.mockReturnValue({\n        ...mockFeedStore,\n        posts: existingPosts,\n      })\n\n      const mockResponse = {\n        success: true,\n        posts: newPosts,\n        pagination: {\n          page: 2,\n          limit: 20,\n          total: 2,\n          hasMore: false,\n        },\n      }\n\n      mockApiGet.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.loadMorePosts()\n      })\n\n      expect(mockApiGet).toHaveBeenCalledWith('/api/posts', {\n        params: {\n          page: 2,\n          limit: 20,\n          type: 'following',\n        },\n      })\n\n      expect(mockFeedStore.setPosts).toHaveBeenCalledWith([...existingPosts, ...newPosts])\n      expect(mockFeedStore.setHasMore).toHaveBeenCalledWith(false)\n    })\n\n    it('should not load more when no more posts available', async () => {\n      mockUseFeedStore.mockReturnValue({\n        ...mockFeedStore,\n        hasMore: false,\n      })\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.loadMorePosts()\n      })\n\n      expect(mockApiGet).not.toHaveBeenCalled()\n    })\n\n    it('should not load more when already loading', async () => {\n      mockUseFeedStore.mockReturnValue({\n        ...mockFeedStore,\n        loading: true,\n      })\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.loadMorePosts()\n      })\n\n      expect(mockApiGet).not.toHaveBeenCalled()\n    })\n  })\n\n  describe('refreshPosts', () => {\n    it('should refresh posts successfully', async () => {\n      const mockResponse = {\n        success: true,\n        posts: mockPosts,\n        pagination: {\n          page: 1,\n          limit: 20,\n          total: 2,\n          hasMore: false,\n        },\n      }\n\n      mockApiGet.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.refreshPosts()\n      })\n\n      expect(mockFeedStore.setError).toHaveBeenCalledWith(null)\n      expect(mockFeedStore.clearOptimisticUpdates).toHaveBeenCalled()\n      expect(mockApiGet).toHaveBeenCalledWith('/api/posts', {\n        params: {\n          page: 1,\n          limit: 20,\n          type: 'following',\n        },\n      })\n    })\n  })\n\n  describe('changeFeedType', () => {\n    it('should change feed type and refresh posts', async () => {\n      const mockResponse = {\n        success: true,\n        posts: mockPosts,\n        pagination: {\n          page: 1,\n          limit: 20,\n          total: 2,\n          hasMore: false,\n        },\n      }\n\n      mockApiGet.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.changeFeedType('discover')\n      })\n\n      expect(mockFeedStore.setFeedType).toHaveBeenCalledWith('discover')\n      expect(mockFeedStore.setPosts).toHaveBeenCalledWith([])\n      expect(mockApiGet).toHaveBeenCalledWith('/api/posts', {\n        params: {\n          page: 1,\n          limit: 20,\n          type: 'discover',\n        },\n      })\n    })\n  })\n\n  describe('Edge Cases and Error Handling', () => {\n    it('should handle network errors gracefully', async () => {\n      const networkError = new Error('Network error')\n      networkError.name = 'NetworkError'\n      \n      mockApiGet.mockRejectedValue(networkError)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.fetchPosts()\n      })\n\n      expect(mockFeedStore.setError).toHaveBeenCalledWith('Network error')\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Network Error',\n        description: 'Please check your internet connection and try again.',\n      })\n    })\n\n    it('should handle API response without posts array', async () => {\n      const mockResponse = {\n        success: true,\n        // Missing posts array\n        pagination: {\n          page: 1,\n          limit: 20,\n          total: 0,\n          hasMore: false,\n        },\n      }\n\n      mockApiGet.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.fetchPosts()\n      })\n\n      expect(mockFeedStore.setPosts).toHaveBeenCalledWith([])\n    })\n\n    it('should handle malformed API responses', async () => {\n      const malformedResponse = {\n        // Missing success field and other required fields\n        data: 'invalid',\n      }\n\n      mockApiGet.mockResolvedValue(malformedResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.fetchPosts()\n      })\n\n      expect(mockFeedStore.setError).toHaveBeenCalledWith('Invalid response format')\n    })\n  })\n\n  describe('Performance and Optimization', () => {\n    it('should debounce rapid successive calls', async () => {\n      const mockResponse = {\n        success: true,\n        posts: mockPosts,\n        pagination: { page: 1, limit: 20, total: 2, hasMore: false },\n      }\n\n      mockApiGet.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      // Make multiple rapid calls\n      await act(async () => {\n        result.current.fetchPosts()\n        result.current.fetchPosts()\n        result.current.fetchPosts()\n      })\n\n      // Should only make one API call due to debouncing\n      expect(mockApiGet).toHaveBeenCalledTimes(1)\n    })\n\n    it('should cancel previous requests when new ones are made', async () => {\n      const { result } = renderHook(() => usePosts())\n\n      // Start first request\n      act(() => {\n        result.current.fetchPosts()\n      })\n\n      // Start second request before first completes\n      await act(async () => {\n        await result.current.fetchPosts()\n      })\n\n      // Should handle request cancellation gracefully\n      expect(mockFeedStore.setLoading).toHaveBeenCalledWith(false)\n    })\n  })\n})"
         : [31;1m                        ^[0m
         `----


    Caused by:
        Syntax Error

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)

FAIL src/__tests__/stores/feed-store.test.ts
  ● Test suite failed to run

    Cannot find module '@/hooks/use-api' from 'src/__tests__/stores/feed-store.test.ts'

    [0m [90m 3 |[39m
     [90m 4 |[39m [90m// Mock API calls[39m
    [31m[1m>[22m[39m[90m 5 |[39m jest[33m.[39mmock([32m'@/hooks/use-api'[39m[33m,[39m () [33m=>[39m ({
     [90m   |[39m      [31m[1m^[22m[39m
     [90m 6 |[39m   useApi[33m:[39m () [33m=>[39m ({
     [90m 7 |[39m     [36mget[39m[33m:[39m jest[33m.[39mfn()[33m,[39m
     [90m 8 |[39m     post[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/stores/feed-store.test.ts:5:6)

FAIL src/__tests__/lib/bundle-optimization.test.ts
  ● Test suite failed to run


      [31mx[0m Expected '>', got 'fallback'
        ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\lib\bundle-optimization.ts[0m:21:1]
     [2m21[0m |   if (suspense) {
     [2m22[0m |     const LazyComponent = lazy(importFn)
     [2m23[0m |     return (props: T) => (
     [2m24[0m |       <Suspense fallback={loading ? <loading /> : <div>Loading...</div>}>
        : [31;1m                ^^^^^^^^[0m
     [2m25[0m |         <LazyComponent {...props} />
     [2m26[0m |       </Suspense>
     [2m26[0m |     )
        `----


    Caused by:
        Syntax Error

    [0m [90m 11 |[39m   [36mreturn[39m jest[33m.[39mfn((importFn) [33m=>[39m {
     [90m 12 |[39m     [36mconst[39m [33mMockComponent[39m [33m=[39m () [33m=>[39m [32m'Mocked Component'[39m
    [31m[1m>[22m[39m[90m 13 |[39m     [33mMockComponent[39m[33m.[39mdisplayName [33m=[39m [32m'MockDynamicComponent'[39m
     [90m    |[39m                             [31m[1m^[22m[39m
     [90m 14 |[39m     [36mreturn[39m [33mMockComponent[39m
     [90m 15 |[39m   })
     [90m 16 |[39m })[0m

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)
      at Object.<anonymous> (src/__tests__/lib/bundle-optimization.test.ts:13:29)

FAIL src/__tests__/integration/post-creation-flow.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/integration/post-creation-flow.test.ts'

    [0m [90m  5 |[39m [90m// Mock dependencies[39m
     [90m  6 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m  7 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m  8 |[39m   prisma[33m:[39m {
     [90m  9 |[39m     post[33m:[39m {
     [90m 10 |[39m       create[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/integration/post-creation-flow.test.ts:7:6)

FAIL src/__tests__/integration/post-interactions.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/integration/post-interactions.test.ts'

    [0m [90m  7 |[39m
     [90m  8 |[39m [90m// Mock dependencies[39m
    [31m[1m>[22m[39m[90m  9 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m 10 |[39m   prisma[33m:[39m {
     [90m 11 |[39m     post[33m:[39m {
     [90m 12 |[39m       create[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/integration/post-interactions.test.ts:9:6)

FAIL src/__tests__/integration/end-to-end-flow.test.ts
  ● Test suite failed to run


      [31mx[0m Expression expected
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\integration\end-to-end-flow.test.ts[0m:113:1]
     [2m113[0m |   describe('Complete User Journey: New User to Active Community Member', () => {
     [2m114[0m |     it('should guide a new user through the complete onboarding and engagement flow', async () => {
     [2m115[0m |       // Step 1: Landing Page Experience
     [2m116[0m |       const { rerender } = render(<LandingPage />)
         : [31;1m                                               ^[0m
     [2m117[0m |       
     [2m118[0m |       // User sees attractive landing page
     [2m118[0m |       expect(screen.getByText(/community platform/i)).toBeInTheDocument()
         `----

      [31mx[0m Expression expected
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\integration\end-to-end-flow.test.ts[0m:113:1]
     [2m113[0m |   describe('Complete User Journey: New User to Active Community Member', () => {
     [2m114[0m |     it('should guide a new user through the complete onboarding and engagement flow', async () => {
     [2m115[0m |       // Step 1: Landing Page Experience
     [2m116[0m |       const { rerender } = render(<LandingPage />)
         : [31;1m                                                ^[0m
     [2m117[0m |       
     [2m118[0m |       // User sees attractive landing page
     [2m118[0m |       expect(screen.getByText(/community platform/i)).toBeInTheDocument()
         `----

      [31mx[0m Expression expected
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\integration\end-to-end-flow.test.ts[0m:113:1]
     [2m113[0m |   describe('Complete User Journey: New User to Active Community Member', () => {
     [2m114[0m |     it('should guide a new user through the complete onboarding and engagement flow', async () => {
     [2m115[0m |       // Step 1: Landing Page Experience
     [2m116[0m |       const { rerender } = render(<LandingPage />)
         : [31;1m                                                 ^[0m
     [2m117[0m |       
     [2m118[0m |       // User sees attractive landing page
     [2m118[0m |       expect(screen.getByText(/community platform/i)).toBeInTheDocument()
         `----


    Caused by:
        Syntax Error

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)

FAIL src/__tests__/integration/complete-user-journey.test.ts
  ● Test suite failed to run


      [31mx[0m Expression expected
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\integration\complete-user-journey.test.ts[0m:173:1]
     [2m173[0m |     it('should handle authentication flow correctly', async () => {
     [2m174[0m |       const { signIn } = require('next-auth/react')
     [2m175[0m |       
     [2m176[0m |       render(<LandingPage />)
         : [31;1m                          ^[0m
     [2m177[0m |       
     [2m178[0m |       // Should show sign-in options
     [2m178[0m |       expect(screen.getByText(/sign in/i)).toBeInTheDocument()
         `----

      [31mx[0m Expression expected
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\integration\complete-user-journey.test.ts[0m:173:1]
     [2m173[0m |     it('should handle authentication flow correctly', async () => {
     [2m174[0m |       const { signIn } = require('next-auth/react')
     [2m175[0m |       
     [2m176[0m |       render(<LandingPage />)
         : [31;1m                           ^[0m
     [2m177[0m |       
     [2m178[0m |       // Should show sign-in options
     [2m178[0m |       expect(screen.getByText(/sign in/i)).toBeInTheDocument()
         `----

      [31mx[0m Expression expected
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\integration\complete-user-journey.test.ts[0m:173:1]
     [2m173[0m |     it('should handle authentication flow correctly', async () => {
     [2m174[0m |       const { signIn } = require('next-auth/react')
     [2m175[0m |       
     [2m176[0m |       render(<LandingPage />)
         : [31;1m                            ^[0m
     [2m177[0m |       
     [2m178[0m |       // Should show sign-in options
     [2m178[0m |       expect(screen.getByText(/sign in/i)).toBeInTheDocument()
         `----


    Caused by:
        Syntax Error

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)

FAIL src/__tests__/integration/auth-flow.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/integration/auth-flow.test.ts'

    [0m [90m  5 |[39m
     [90m  6 |[39m [90m// Mock Prisma[39m
    [31m[1m>[22m[39m[90m  7 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m  8 |[39m   prisma[33m:[39m {
     [90m  9 |[39m     user[33m:[39m {
     [90m 10 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/integration/auth-flow.test.ts:7:6)

FAIL src/__tests__/hooks/use-comments.test.ts (8.252 s)
  ● Console

    console.warn
      [DEPRECATED] `getStorage`, `serialize` and `deserialize` options are deprecated. Use `storage` option instead.

    [0m [90m 77 |[39m [36mexport[39m [36mconst[39m useUserStore [33m=[39m create[33m<[39m[33mUserState[39m[33m>[39m()(
     [90m 78 |[39m   devtools(
    [31m[1m>[22m[39m[90m 79 |[39m     persist(
     [90m    |[39m            [31m[1m^[22m[39m
     [90m 80 |[39m       ([36mset[39m[33m,[39m [36mget[39m) [33m=>[39m ({
     [90m 81 |[39m         [90m// Initial state[39m
     [90m 82 |[39m         currentUser[33m:[39m [36mnull[39m[33m,[39m[0m

      at persistImpl (node_modules/zustand/middleware.js:596:15)
      at Object.<anonymous> (src/stores/user-store.ts:79:12)
      at Object.<anonymous> (src/hooks/use-comments.ts:2442:28)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:8:22)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:47:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:47:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:47:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 45 |[39m     })
     [90m 46 |[39m
    [31m[1m>[22m[39m[90m 47 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m    |[39m                                  [31m[1m^[22m[39m
     [90m 48 |[39m
     [90m 49 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual(mockComments)
     [90m 50 |[39m     expect(result[33m.[39mcurrent[33m.[39mtotal)[33m.[39mtoBe([35m2[39m)[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25777:74)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:47:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:47:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:47:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:47:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 45 |[39m     })
     [90m 46 |[39m
    [31m[1m>[22m[39m[90m 47 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m    |[39m                                  [31m[1m^[22m[39m
     [90m 48 |[39m
     [90m 49 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual(mockComments)
     [90m 50 |[39m     expect(result[33m.[39mcurrent[33m.[39mtotal)[33m.[39mtoBe([35m2[39m)[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:47:34)

    console.error
      The above error occurred in the <TestComponent> component:
      
          at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:329:5)
      
      Consider adding an error boundary to your tree to customize error handling behavior.
      Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.

    [0m [90m 45 |[39m     })
     [90m 46 |[39m
    [31m[1m>[22m[39m[90m 47 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m    |[39m                                  [31m[1m^[22m[39m
     [90m 48 |[39m
     [90m 49 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual(mockComments)
     [90m 50 |[39m     expect(result[33m.[39mcurrent[33m.[39mtotal)[33m.[39mtoBe([35m2[39m)[0m

      at logCapturedError (node_modules/react-dom/cjs/react-dom.development.js:18704:23)
      at update.callback (node_modules/react-dom/cjs/react-dom.development.js:18737:5)
      at callCallback (node_modules/react-dom/cjs/react-dom.development.js:15036:12)
      at commitUpdateQueue (node_modules/react-dom/cjs/react-dom.development.js:15057:9)
      at commitLayoutEffectOnFiber (node_modules/react-dom/cjs/react-dom.development.js:23430:13)
      at commitLayoutMountEffects_complete (node_modules/react-dom/cjs/react-dom.development.js:24727:9)
      at commitLayoutEffects_begin (node_modules/react-dom/cjs/react-dom.development.js:24713:7)
      at commitLayoutEffects (node_modules/react-dom/cjs/react-dom.development.js:24651:3)
      at commitRootImpl (node_modules/react-dom/cjs/react-dom.development.js:26862:5)
      at commitRoot (node_modules/react-dom/cjs/react-dom.development.js:26721:5)
      at finishConcurrentRender (node_modules/react-dom/cjs/react-dom.development.js:25931:9)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25848:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:47:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:63:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:63:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:63:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 61 |[39m     })
     [90m 62 |[39m
    [31m[1m>[22m[39m[90m 63 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m    |[39m                                  [31m[1m^[22m[39m
     [90m 64 |[39m
     [90m 65 |[39m     expect(result[33m.[39mcurrent[33m.[39misLoading)[33m.[39mtoBe([36mtrue[39m)
     [90m 66 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual([])[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25777:74)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:63:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:63:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:63:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:63:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 61 |[39m     })
     [90m 62 |[39m
    [31m[1m>[22m[39m[90m 63 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m    |[39m                                  [31m[1m^[22m[39m
     [90m 64 |[39m
     [90m 65 |[39m     expect(result[33m.[39mcurrent[33m.[39misLoading)[33m.[39mtoBe([36mtrue[39m)
     [90m 66 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual([])[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:63:34)

    console.error
      The above error occurred in the <TestComponent> component:
      
          at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:329:5)
      
      Consider adding an error boundary to your tree to customize error handling behavior.
      Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.

    [0m [90m 61 |[39m     })
     [90m 62 |[39m
    [31m[1m>[22m[39m[90m 63 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m    |[39m                                  [31m[1m^[22m[39m
     [90m 64 |[39m
     [90m 65 |[39m     expect(result[33m.[39mcurrent[33m.[39misLoading)[33m.[39mtoBe([36mtrue[39m)
     [90m 66 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual([])[0m

      at logCapturedError (node_modules/react-dom/cjs/react-dom.development.js:18704:23)
      at update.callback (node_modules/react-dom/cjs/react-dom.development.js:18737:5)
      at callCallback (node_modules/react-dom/cjs/react-dom.development.js:15036:12)
      at commitUpdateQueue (node_modules/react-dom/cjs/react-dom.development.js:15057:9)
      at commitLayoutEffectOnFiber (node_modules/react-dom/cjs/react-dom.development.js:23430:13)
      at commitLayoutMountEffects_complete (node_modules/react-dom/cjs/react-dom.development.js:24727:9)
      at commitLayoutEffects_begin (node_modules/react-dom/cjs/react-dom.development.js:24713:7)
      at commitLayoutEffects (node_modules/react-dom/cjs/react-dom.development.js:24651:3)
      at commitRootImpl (node_modules/react-dom/cjs/react-dom.development.js:26862:5)
      at commitRoot (node_modules/react-dom/cjs/react-dom.development.js:26721:5)
      at finishConcurrentRender (node_modules/react-dom/cjs/react-dom.development.js:25931:9)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25848:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:63:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:78:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:78:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:78:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 76 |[39m     })
     [90m 77 |[39m
    [31m[1m>[22m[39m[90m 78 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m    |[39m                                  [31m[1m^[22m[39m
     [90m 79 |[39m
     [90m 80 |[39m     expect(result[33m.[39mcurrent[33m.[39merror)[33m.[39mtoBe(error)
     [90m 81 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual([])[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25777:74)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:78:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:78:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:78:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:78:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 76 |[39m     })
     [90m 77 |[39m
    [31m[1m>[22m[39m[90m 78 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m    |[39m                                  [31m[1m^[22m[39m
     [90m 79 |[39m
     [90m 80 |[39m     expect(result[33m.[39mcurrent[33m.[39merror)[33m.[39mtoBe(error)
     [90m 81 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual([])[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:78:34)

    console.error
      The above error occurred in the <TestComponent> component:
      
          at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:329:5)
      
      Consider adding an error boundary to your tree to customize error handling behavior.
      Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.

    [0m [90m 76 |[39m     })
     [90m 77 |[39m
    [31m[1m>[22m[39m[90m 78 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m    |[39m                                  [31m[1m^[22m[39m
     [90m 79 |[39m
     [90m 80 |[39m     expect(result[33m.[39mcurrent[33m.[39merror)[33m.[39mtoBe(error)
     [90m 81 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual([])[0m

      at logCapturedError (node_modules/react-dom/cjs/react-dom.development.js:18704:23)
      at update.callback (node_modules/react-dom/cjs/react-dom.development.js:18737:5)
      at callCallback (node_modules/react-dom/cjs/react-dom.development.js:15036:12)
      at commitUpdateQueue (node_modules/react-dom/cjs/react-dom.development.js:15057:9)
      at commitLayoutEffectOnFiber (node_modules/react-dom/cjs/react-dom.development.js:23430:13)
      at commitLayoutMountEffects_complete (node_modules/react-dom/cjs/react-dom.development.js:24727:9)
      at commitLayoutEffects_begin (node_modules/react-dom/cjs/react-dom.development.js:24713:7)
      at commitLayoutEffects (node_modules/react-dom/cjs/react-dom.development.js:24651:3)
      at commitRootImpl (node_modules/react-dom/cjs/react-dom.development.js:26862:5)
      at commitRoot (node_modules/react-dom/cjs/react-dom.development.js:26721:5)
      at finishConcurrentRender (node_modules/react-dom/cjs/react-dom.development.js:25931:9)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25848:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:78:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:106:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:106:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:106:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 104 |[39m     })
     [90m 105 |[39m
    [31m[1m>[22m[39m[90m 106 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 107 |[39m
     [90m 108 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
     [90m 109 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mcreateComment([32m'New comment'[39m)[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25777:74)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:106:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:106:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:106:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:106:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 104 |[39m     })
     [90m 105 |[39m
    [31m[1m>[22m[39m[90m 106 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 107 |[39m
     [90m 108 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
     [90m 109 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mcreateComment([32m'New comment'[39m)[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:106:34)

    console.error
      The above error occurred in the <TestComponent> component:
      
          at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:329:5)
      
      Consider adding an error boundary to your tree to customize error handling behavior.
      Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.

    [0m [90m 104 |[39m     })
     [90m 105 |[39m
    [31m[1m>[22m[39m[90m 106 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 107 |[39m
     [90m 108 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
     [90m 109 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mcreateComment([32m'New comment'[39m)[0m

      at logCapturedError (node_modules/react-dom/cjs/react-dom.development.js:18704:23)
      at update.callback (node_modules/react-dom/cjs/react-dom.development.js:18737:5)
      at callCallback (node_modules/react-dom/cjs/react-dom.development.js:15036:12)
      at commitUpdateQueue (node_modules/react-dom/cjs/react-dom.development.js:15057:9)
      at commitLayoutEffectOnFiber (node_modules/react-dom/cjs/react-dom.development.js:23430:13)
      at commitLayoutMountEffects_complete (node_modules/react-dom/cjs/react-dom.development.js:24727:9)
      at commitLayoutEffects_begin (node_modules/react-dom/cjs/react-dom.development.js:24713:7)
      at commitLayoutEffects (node_modules/react-dom/cjs/react-dom.development.js:24651:3)
      at commitRootImpl (node_modules/react-dom/cjs/react-dom.development.js:26862:5)
      at commitRoot (node_modules/react-dom/cjs/react-dom.development.js:26721:5)
      at finishConcurrentRender (node_modules/react-dom/cjs/react-dom.development.js:25931:9)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25848:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:106:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:132:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:132:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:132:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 130 |[39m     [33m;[39m(global[33m.[39mfetch [36mas[39m jest[33m.[39m[33mMock[39m)[33m.[39mmockRejectedValue([36mnew[39m [33mError[39m([32m'Network error'[39m))
     [90m 131 |[39m
    [31m[1m>[22m[39m[90m 132 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 133 |[39m
     [90m 134 |[39m     [36mawait[39m expect(result[33m.[39mcurrent[33m.[39mcreateComment([32m'New comment'[39m))[33m.[39mrejects[33m.[39mtoThrow([32m'Network error'[39m)
     [90m 135 |[39m   })[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25777:74)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:132:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:132:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:132:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:132:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 130 |[39m     [33m;[39m(global[33m.[39mfetch [36mas[39m jest[33m.[39m[33mMock[39m)[33m.[39mmockRejectedValue([36mnew[39m [33mError[39m([32m'Network error'[39m))
     [90m 131 |[39m
    [31m[1m>[22m[39m[90m 132 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 133 |[39m
     [90m 134 |[39m     [36mawait[39m expect(result[33m.[39mcurrent[33m.[39mcreateComment([32m'New comment'[39m))[33m.[39mrejects[33m.[39mtoThrow([32m'Network error'[39m)
     [90m 135 |[39m   })[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:132:34)

    console.error
      The above error occurred in the <TestComponent> component:
      
          at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:329:5)
      
      Consider adding an error boundary to your tree to customize error handling behavior.
      Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.

    [0m [90m 130 |[39m     [33m;[39m(global[33m.[39mfetch [36mas[39m jest[33m.[39m[33mMock[39m)[33m.[39mmockRejectedValue([36mnew[39m [33mError[39m([32m'Network error'[39m))
     [90m 131 |[39m
    [31m[1m>[22m[39m[90m 132 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 133 |[39m
     [90m 134 |[39m     [36mawait[39m expect(result[33m.[39mcurrent[33m.[39mcreateComment([32m'New comment'[39m))[33m.[39mrejects[33m.[39mtoThrow([32m'Network error'[39m)
     [90m 135 |[39m   })[0m

      at logCapturedError (node_modules/react-dom/cjs/react-dom.development.js:18704:23)
      at update.callback (node_modules/react-dom/cjs/react-dom.development.js:18737:5)
      at callCallback (node_modules/react-dom/cjs/react-dom.development.js:15036:12)
      at commitUpdateQueue (node_modules/react-dom/cjs/react-dom.development.js:15057:9)
      at commitLayoutEffectOnFiber (node_modules/react-dom/cjs/react-dom.development.js:23430:13)
      at commitLayoutMountEffects_complete (node_modules/react-dom/cjs/react-dom.development.js:24727:9)
      at commitLayoutEffects_begin (node_modules/react-dom/cjs/react-dom.development.js:24713:7)
      at commitLayoutEffects (node_modules/react-dom/cjs/react-dom.development.js:24651:3)
      at commitRootImpl (node_modules/react-dom/cjs/react-dom.development.js:26862:5)
      at commitRoot (node_modules/react-dom/cjs/react-dom.development.js:26721:5)
      at finishConcurrentRender (node_modules/react-dom/cjs/react-dom.development.js:25931:9)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25848:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:132:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:151:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:151:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:151:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 149 |[39m     })
     [90m 150 |[39m
    [31m[1m>[22m[39m[90m 151 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 152 |[39m
     [90m 153 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
     [90m 154 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mdeleteComment([32m'comment-1'[39m)[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25777:74)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:151:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:151:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:151:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:151:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 149 |[39m     })
     [90m 150 |[39m
    [31m[1m>[22m[39m[90m 151 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 152 |[39m
     [90m 153 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
     [90m 154 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mdeleteComment([32m'comment-1'[39m)[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:151:34)

    console.error
      The above error occurred in the <TestComponent> component:
      
          at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:329:5)
      
      Consider adding an error boundary to your tree to customize error handling behavior.
      Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.

    [0m [90m 149 |[39m     })
     [90m 150 |[39m
    [31m[1m>[22m[39m[90m 151 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 152 |[39m
     [90m 153 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
     [90m 154 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mdeleteComment([32m'comment-1'[39m)[0m

      at logCapturedError (node_modules/react-dom/cjs/react-dom.development.js:18704:23)
      at update.callback (node_modules/react-dom/cjs/react-dom.development.js:18737:5)
      at callCallback (node_modules/react-dom/cjs/react-dom.development.js:15036:12)
      at commitUpdateQueue (node_modules/react-dom/cjs/react-dom.development.js:15057:9)
      at commitLayoutEffectOnFiber (node_modules/react-dom/cjs/react-dom.development.js:23430:13)
      at commitLayoutMountEffects_complete (node_modules/react-dom/cjs/react-dom.development.js:24727:9)
      at commitLayoutEffects_begin (node_modules/react-dom/cjs/react-dom.development.js:24713:7)
      at commitLayoutEffects (node_modules/react-dom/cjs/react-dom.development.js:24651:3)
      at commitRootImpl (node_modules/react-dom/cjs/react-dom.development.js:26862:5)
      at commitRoot (node_modules/react-dom/cjs/react-dom.development.js:26721:5)
      at finishConcurrentRender (node_modules/react-dom/cjs/react-dom.development.js:25931:9)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25848:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:151:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:175:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:175:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:175:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 173 |[39m     [33m;[39m(global[33m.[39mfetch [36mas[39m jest[33m.[39m[33mMock[39m)[33m.[39mmockRejectedValue([36mnew[39m [33mError[39m([32m'Network error'[39m))
     [90m 174 |[39m
    [31m[1m>[22m[39m[90m 175 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 176 |[39m
     [90m 177 |[39m     [36mawait[39m expect(result[33m.[39mcurrent[33m.[39mdeleteComment([32m'comment-1'[39m))[33m.[39mrejects[33m.[39mtoThrow([32m'Network error'[39m)
     [90m 178 |[39m   })[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25777:74)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:175:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:175:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:175:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:175:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 173 |[39m     [33m;[39m(global[33m.[39mfetch [36mas[39m jest[33m.[39m[33mMock[39m)[33m.[39mmockRejectedValue([36mnew[39m [33mError[39m([32m'Network error'[39m))
     [90m 174 |[39m
    [31m[1m>[22m[39m[90m 175 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 176 |[39m
     [90m 177 |[39m     [36mawait[39m expect(result[33m.[39mcurrent[33m.[39mdeleteComment([32m'comment-1'[39m))[33m.[39mrejects[33m.[39mtoThrow([32m'Network error'[39m)
     [90m 178 |[39m   })[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:175:34)

    console.error
      The above error occurred in the <TestComponent> component:
      
          at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:329:5)
      
      Consider adding an error boundary to your tree to customize error handling behavior.
      Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.

    [0m [90m 173 |[39m     [33m;[39m(global[33m.[39mfetch [36mas[39m jest[33m.[39m[33mMock[39m)[33m.[39mmockRejectedValue([36mnew[39m [33mError[39m([32m'Network error'[39m))
     [90m 174 |[39m
    [31m[1m>[22m[39m[90m 175 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 176 |[39m
     [90m 177 |[39m     [36mawait[39m expect(result[33m.[39mcurrent[33m.[39mdeleteComment([32m'comment-1'[39m))[33m.[39mrejects[33m.[39mtoThrow([32m'Network error'[39m)
     [90m 178 |[39m   })[0m

      at logCapturedError (node_modules/react-dom/cjs/react-dom.development.js:18704:23)
      at update.callback (node_modules/react-dom/cjs/react-dom.development.js:18737:5)
      at callCallback (node_modules/react-dom/cjs/react-dom.development.js:15036:12)
      at commitUpdateQueue (node_modules/react-dom/cjs/react-dom.development.js:15057:9)
      at commitLayoutEffectOnFiber (node_modules/react-dom/cjs/react-dom.development.js:23430:13)
      at commitLayoutMountEffects_complete (node_modules/react-dom/cjs/react-dom.development.js:24727:9)
      at commitLayoutEffects_begin (node_modules/react-dom/cjs/react-dom.development.js:24713:7)
      at commitLayoutEffects (node_modules/react-dom/cjs/react-dom.development.js:24651:3)
      at commitRootImpl (node_modules/react-dom/cjs/react-dom.development.js:26862:5)
      at commitRoot (node_modules/react-dom/cjs/react-dom.development.js:26721:5)
      at finishConcurrentRender (node_modules/react-dom/cjs/react-dom.development.js:25931:9)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25848:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:175:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:188:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:188:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:188:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 186 |[39m     })
     [90m 187 |[39m
    [31m[1m>[22m[39m[90m 188 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([36mnull[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 189 |[39m
     [90m 190 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual([])
     [90m 191 |[39m     expect(result[33m.[39mcurrent[33m.[39mtotal)[33m.[39mtoBe([35m0[39m)[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25777:74)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:188:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:188:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:188:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:188:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 186 |[39m     })
     [90m 187 |[39m
    [31m[1m>[22m[39m[90m 188 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([36mnull[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 189 |[39m
     [90m 190 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual([])
     [90m 191 |[39m     expect(result[33m.[39mcurrent[33m.[39mtotal)[33m.[39mtoBe([35m0[39m)[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:188:34)

    console.error
      The above error occurred in the <TestComponent> component:
      
          at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:329:5)
      
      Consider adding an error boundary to your tree to customize error handling behavior.
      Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.

    [0m [90m 186 |[39m     })
     [90m 187 |[39m
    [31m[1m>[22m[39m[90m 188 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([36mnull[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 189 |[39m
     [90m 190 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual([])
     [90m 191 |[39m     expect(result[33m.[39mcurrent[33m.[39mtotal)[33m.[39mtoBe([35m0[39m)[0m

      at logCapturedError (node_modules/react-dom/cjs/react-dom.development.js:18704:23)
      at update.callback (node_modules/react-dom/cjs/react-dom.development.js:18737:5)
      at callCallback (node_modules/react-dom/cjs/react-dom.development.js:15036:12)
      at commitUpdateQueue (node_modules/react-dom/cjs/react-dom.development.js:15057:9)
      at commitLayoutEffectOnFiber (node_modules/react-dom/cjs/react-dom.development.js:23430:13)
      at commitLayoutMountEffects_complete (node_modules/react-dom/cjs/react-dom.development.js:24727:9)
      at commitLayoutEffects_begin (node_modules/react-dom/cjs/react-dom.development.js:24713:7)
      at commitLayoutEffects (node_modules/react-dom/cjs/react-dom.development.js:24651:3)
      at commitRootImpl (node_modules/react-dom/cjs/react-dom.development.js:26862:5)
      at commitRoot (node_modules/react-dom/cjs/react-dom.development.js:26721:5)
      at finishConcurrentRender (node_modules/react-dom/cjs/react-dom.development.js:25931:9)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25848:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:188:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:203:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:203:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25777:74)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:203:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 201 |[39m     })
     [90m 202 |[39m
    [31m[1m>[22m[39m[90m 203 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 204 |[39m
     [90m 205 |[39m     [36mawait[39m result[33m.[39mcurrent[33m.[39mrefresh()
     [90m 206 |[39m[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25777:74)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:203:34)

    console.error
      Error: Uncaught [TypeError: (0 , _usecomments.useComments) is not a function]
          at reportException (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\helpers\runtime-script-errors.js:66:24)
          at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:353:9)
          at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
          at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
          at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
          at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
          at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
          at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
          at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
          at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
          at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
          at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
          at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
          at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
          at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
          at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
          at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
          at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
          at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
          at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:203:34)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:95:5)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12) {
        detail: TypeError: (0 , _usecomments.useComments) is not a function
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:203:52
            at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:331:27)
            at renderWithHooks (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:15486:18)
            at mountIndeterminateComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:20103:13)
            at beginWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:21626:16)
            at HTMLUnknownElement.callCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4164:14)
            at HTMLUnknownElement.callTheUserObjectsOperation (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventListener.js:26:30)
            at innerInvokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:350:25)
            at invokeEventListeners (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:286:3)
            at HTMLUnknownElementImpl._dispatch (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:233:9)
            at HTMLUnknownElementImpl.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\events\EventTarget-impl.js:104:17)
            at HTMLUnknownElement.dispatchEvent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jsdom\lib\jsdom\living\generated\EventTarget.js:241:34)
            at Object.invokeGuardedCallbackDev (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4213:16)
            at invokeGuardedCallback (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:4277:31)
            at beginWork$1 (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:27490:7)
            at performUnitOfWork (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26599:12)
            at workLoopSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26505:5)
            at renderRootSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:26473:7)
            at recoverFromConcurrentError (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25889:20)
            at performConcurrentWorkOnRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react-dom\cjs\react-dom.development.js:25789:22)
            at flushActQueue (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2667:24)
            at act (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\react\cjs\react.development.js:2582:11)
            at C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\act-compat.js:47:25
            at renderRoot (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:190:26)
            at render (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:292:10)
            at renderHook (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:340:7)
            at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-comments.test.ts:203:34)
            at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
            at new Promise (<anonymous>)
            at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
            at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
            at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
            at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
            at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
            at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
            at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
            at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
            at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
            at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12),
        type: 'unhandled exception'
      }

    [0m [90m 201 |[39m     })
     [90m 202 |[39m
    [31m[1m>[22m[39m[90m 203 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 204 |[39m
     [90m 205 |[39m     [36mawait[39m result[33m.[39mcurrent[33m.[39mrefresh()
     [90m 206 |[39m[0m

      at VirtualConsole.<anonymous> (node_modules/jest-environment-jsdom/build/index.js:63:23)
      at reportException (node_modules/jsdom/lib/jsdom/living/helpers/runtime-script-errors.js:70:28)
      at innerInvokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:353:9)
      at invokeEventListeners (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at HTMLUnknownElementImpl._dispatch (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at HTMLUnknownElementImpl.dispatchEvent (node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at HTMLUnknownElement.dispatchEvent (node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:4213:16)
      at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4277:31)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27490:7)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:203:34)

    console.error
      The above error occurred in the <TestComponent> component:
      
          at TestComponent (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@testing-library\react\dist\pure.js:329:5)
      
      Consider adding an error boundary to your tree to customize error handling behavior.
      Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.

    [0m [90m 201 |[39m     })
     [90m 202 |[39m
    [31m[1m>[22m[39m[90m 203 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                  [31m[1m^[22m[39m
     [90m 204 |[39m
     [90m 205 |[39m     [36mawait[39m result[33m.[39mcurrent[33m.[39mrefresh()
     [90m 206 |[39m[0m

      at logCapturedError (node_modules/react-dom/cjs/react-dom.development.js:18704:23)
      at update.callback (node_modules/react-dom/cjs/react-dom.development.js:18737:5)
      at callCallback (node_modules/react-dom/cjs/react-dom.development.js:15036:12)
      at commitUpdateQueue (node_modules/react-dom/cjs/react-dom.development.js:15057:9)
      at commitLayoutEffectOnFiber (node_modules/react-dom/cjs/react-dom.development.js:23430:13)
      at commitLayoutMountEffects_complete (node_modules/react-dom/cjs/react-dom.development.js:24727:9)
      at commitLayoutEffects_begin (node_modules/react-dom/cjs/react-dom.development.js:24713:7)
      at commitLayoutEffects (node_modules/react-dom/cjs/react-dom.development.js:24651:3)
      at commitRootImpl (node_modules/react-dom/cjs/react-dom.development.js:26862:5)
      at commitRoot (node_modules/react-dom/cjs/react-dom.development.js:26721:5)
      at finishConcurrentRender (node_modules/react-dom/cjs/react-dom.development.js:25931:9)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25848:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:203:34)

  ● useComments › should fetch comments for a post

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 45 |[39m     })
     [90m 46 |[39m
    [31m[1m>[22m[39m[90m 47 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m    |[39m                                                    [31m[1m^[22m[39m
     [90m 48 |[39m
     [90m 49 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual(mockComments)
     [90m 50 |[39m     expect(result[33m.[39mcurrent[33m.[39mtotal)[33m.[39mtoBe([35m2[39m)[0m

      at src/__tests__/hooks/use-comments.test.ts:47:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:47:34)

  ● useComments › should handle loading state

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 61 |[39m     })
     [90m 62 |[39m
    [31m[1m>[22m[39m[90m 63 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m    |[39m                                                    [31m[1m^[22m[39m
     [90m 64 |[39m
     [90m 65 |[39m     expect(result[33m.[39mcurrent[33m.[39misLoading)[33m.[39mtoBe([36mtrue[39m)
     [90m 66 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual([])[0m

      at src/__tests__/hooks/use-comments.test.ts:63:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:63:34)

  ● useComments › should handle error state

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 76 |[39m     })
     [90m 77 |[39m
    [31m[1m>[22m[39m[90m 78 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m    |[39m                                                    [31m[1m^[22m[39m
     [90m 79 |[39m
     [90m 80 |[39m     expect(result[33m.[39mcurrent[33m.[39merror)[33m.[39mtoBe(error)
     [90m 81 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual([])[0m

      at src/__tests__/hooks/use-comments.test.ts:78:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:78:34)

  ● useComments › should create a new comment

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 104 |[39m     })
     [90m 105 |[39m
    [31m[1m>[22m[39m[90m 106 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                                    [31m[1m^[22m[39m
     [90m 107 |[39m
     [90m 108 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
     [90m 109 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mcreateComment([32m'New comment'[39m)[0m

      at src/__tests__/hooks/use-comments.test.ts:106:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:106:34)

  ● useComments › should handle comment creation error

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 130 |[39m     [33m;[39m(global[33m.[39mfetch [36mas[39m jest[33m.[39m[33mMock[39m)[33m.[39mmockRejectedValue([36mnew[39m [33mError[39m([32m'Network error'[39m))
     [90m 131 |[39m
    [31m[1m>[22m[39m[90m 132 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                                    [31m[1m^[22m[39m
     [90m 133 |[39m
     [90m 134 |[39m     [36mawait[39m expect(result[33m.[39mcurrent[33m.[39mcreateComment([32m'New comment'[39m))[33m.[39mrejects[33m.[39mtoThrow([32m'Network error'[39m)
     [90m 135 |[39m   })[0m

      at src/__tests__/hooks/use-comments.test.ts:132:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:132:34)

  ● useComments › should delete a comment

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 149 |[39m     })
     [90m 150 |[39m
    [31m[1m>[22m[39m[90m 151 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                                    [31m[1m^[22m[39m
     [90m 152 |[39m
     [90m 153 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
     [90m 154 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mdeleteComment([32m'comment-1'[39m)[0m

      at src/__tests__/hooks/use-comments.test.ts:151:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:151:34)

  ● useComments › should handle comment deletion error

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 173 |[39m     [33m;[39m(global[33m.[39mfetch [36mas[39m jest[33m.[39m[33mMock[39m)[33m.[39mmockRejectedValue([36mnew[39m [33mError[39m([32m'Network error'[39m))
     [90m 174 |[39m
    [31m[1m>[22m[39m[90m 175 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                                    [31m[1m^[22m[39m
     [90m 176 |[39m
     [90m 177 |[39m     [36mawait[39m expect(result[33m.[39mcurrent[33m.[39mdeleteComment([32m'comment-1'[39m))[33m.[39mrejects[33m.[39mtoThrow([32m'Network error'[39m)
     [90m 178 |[39m   })[0m

      at src/__tests__/hooks/use-comments.test.ts:175:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:175:34)

  ● useComments › should not fetch when postId is not provided

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 186 |[39m     })
     [90m 187 |[39m
    [31m[1m>[22m[39m[90m 188 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([36mnull[39m))
     [90m     |[39m                                                    [31m[1m^[22m[39m
     [90m 189 |[39m
     [90m 190 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual([])
     [90m 191 |[39m     expect(result[33m.[39mcurrent[33m.[39mtotal)[33m.[39mtoBe([35m0[39m)[0m

      at src/__tests__/hooks/use-comments.test.ts:188:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:188:34)

  ● useComments › should refresh comments

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 201 |[39m     })
     [90m 202 |[39m
    [31m[1m>[22m[39m[90m 203 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                                    [31m[1m^[22m[39m
     [90m 204 |[39m
     [90m 205 |[39m     [36mawait[39m result[33m.[39mcurrent[33m.[39mrefresh()
     [90m 206 |[39m[0m

      at src/__tests__/hooks/use-comments.test.ts:203:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:203:34)

FAIL src/__tests__/integration/auth-flow-simple.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/integration/auth-flow-simple.test.ts'

    [0m [90m 3 |[39m
     [90m 4 |[39m [90m// Mock Prisma[39m
    [31m[1m>[22m[39m[90m 5 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m   |[39m      [31m[1m^[22m[39m
     [90m 6 |[39m   prisma[33m:[39m {
     [90m 7 |[39m     user[33m:[39m {
     [90m 8 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/integration/auth-flow-simple.test.ts:5:6)

FAIL src/__tests__/integration/admin-functionality.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/integration/admin-functionality.test.ts'

    [0m [90m 10 |[39m
     [90m 11 |[39m [90m// Mock dependencies[39m
    [31m[1m>[22m[39m[90m 12 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m 13 |[39m   prisma[33m:[39m {
     [90m 14 |[39m     user[33m:[39m {
     [90m 15 |[39m       findMany[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/integration/admin-functionality.test.ts:12:6)

FAIL src/__tests__/components/real-time-feed.test.tsx
  ● Test suite failed to run


      [31mx[0m Unexpected token `RealTimeFeed`. Expected jsx identifier
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\components\real-time-feed.test.tsx[0m:309:1]
     [2m309[0m |       mutate: jest.fn(),
     [2m310[0m |     })
     [2m311[0m | 
     [2m312[0m |     render(<RealTimeFeed userId=\"user-1\" />)
         : [31;1m            ^^^^^^^^^^^^[0m
     [2m313[0m | 
     [2m314[0m |     expect(useSWR).toHaveBeenCalledWith(
     [2m314[0m |       '/api/posts?page=1&limit=10&userId=user-1',
         `----


    Caused by:
        Syntax Error

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)

FAIL src/__tests__/integration/admin-access-control.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/integration/admin-access-control.test.ts'

    [0m [90m  5 |[39m [90m// Mock dependencies[39m
     [90m  6 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m  7 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m  8 |[39m   prisma[33m:[39m {
     [90m  9 |[39m     user[33m:[39m {
     [90m 10 |[39m       findMany[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/integration/admin-access-control.test.ts:7:6)

FAIL src/__tests__/components/notification-dropdown.test.tsx
  ● Test suite failed to run


      [31mx[0m Unterminated string constant
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\components\notification-dropdown.test.tsx[0m:143:1]
     [2m143[0m |     fireEvent.click(screen.getByRole('button'))
     [2m144[0m |     
     [2m145[0m |     expect(screen.getByText('No notifications')).toBeInTheDocument()
     [2m146[0m |     expect(screen.getByText(\"You're all caught up!\")).toBeInTheDocument()
         : [31;1m                             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[0m
     [2m147[0m |   })
     [2m148[0m | 
     [2m148[0m |   it('should display notifications correctly', () => {
         `----

      [31mx[0m Expected unicode escape
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\components\notification-dropdown.test.tsx[0m:143:1]
     [2m143[0m |     fireEvent.click(screen.getByRole('button'))
     [2m144[0m |     
     [2m145[0m |     expect(screen.getByText('No notifications')).toBeInTheDocument()
     [2m146[0m |     expect(screen.getByText(\"You're all caught up!\")).toBeInTheDocument()
         : [31;1m                            ^[0m
     [2m147[0m |   })
     [2m148[0m | 
     [2m148[0m |   it('should display notifications correctly', () => {
         `----


    Caused by:
        Syntax Error

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)

FAIL src/__tests__/components/follow-button.test.tsx
  ● Test suite failed to run


      [31mx[0m Unexpected token `FollowButton`. Expected jsx identifier
        ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\components\follow-button.test.tsx[0m:25:1]
     [2m25[0m |   it('should not render when user is not authenticated', () => {
     [2m26[0m |     ;(useSession as jest.Mock).mockReturnValue({ data: null })
     [2m27[0m | 
     [2m28[0m |     const { container } = render(<FollowButton userId=\"user-2\" />)
        : [31;1m                                  ^^^^^^^^^^^^[0m
     [2m29[0m |     expect(container.firstChild).toBeNull()
     [2m30[0m |   })
     [2m30[0m | 
        `----


    Caused by:
        Syntax Error

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)

FAIL src/__tests__/components/enhanced-interactive-feed.test.tsx
  ● Test suite failed to run


      [31mx[0m Expected unicode escape
        ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\components\enhanced-interactive-feed.test.tsx[0m:25:1]
     [2m25[0m |   root: null,
     [2m26[0m |   rootMargin: '',
     [2m27[0m |   thresholds: [],
     [2m28[0m | }))\n\n// Mock ResizeObserver\nglobal.ResizeObserver = jest.fn().mockImplementation(() => ({\n  observe: jest.fn(),\n  unobserve: jest.fn(),\n  disconnect: jest.fn(),\n}))\n\ndescribe('EnhancedInteractiveFeed', () => {\n  const mockUser = {\n    id: 'user-123',\n    username: 'testuser',\n    name: 'Test User',\n    email: 'test@example.com',\n  }\n\n  const mockSession = {\n    user: mockUser,\n    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),\n  }\n\n  const mockPosts = [\n    {\n      id: 'post-1',\n      content: 'First test post',\n      imageUrl: null,\n      createdAt: new Date().toISOString(),\n      updatedAt: new Date().toISOString(),\n      isPublic: true,\n      author: {\n        id: 'author-1',\n        username: 'author1',\n        name: 'Author One',\n        image: null,\n      },\n      _count: {\n        likes: 5,\n        comments: 2,\n      },\n      isLiked: false,\n    },\n    {\n      id: 'post-2',\n      content: 'Second test post with image',\n      imageUrl: 'https://example.com/image.jpg',\n      createdAt: new Date().toISOString(),\n      updatedAt: new Date().toISOString(),\n      isPublic: true,\n      author: {\n        id: 'author-2',\n        username: 'author2',\n        name: 'Author Two',\n        image: 'https://example.com/avatar.jpg',\n      },\n      _count: {\n        likes: 10,\n        comments: 5,\n      },\n      isLiked: true,\n    },\n  ]\n\n  const defaultFeedStore = {\n    posts: mockPosts,\n    loading: false,\n    error: null,\n    hasMore: true,\n    feedType: 'following' as const,\n    lastFetch: Date.now(),\n    optimisticUpdates: new Map(),\n    setPosts: jest.fn(),\n    addPost: jest.fn(),\n    updatePost: jest.fn(),\n    removePost: jest.fn(),\n    setLoading: jest.fn(),\n    setError: jest.fn(),\n    setHasMore: jest.fn(),\n    setFeedType: jest.fn(),\n    loadMorePosts: jest.fn(),\n    refreshFeed: jest.fn(),\n    addOptimisticUpdate: jest.fn(),\n    removeOptimisticUpdate: jest.fn(),\n    clearOptimisticUpdates: jest.fn(),\n  }\n\n  const defaultUIStore = {\n    sidebarOpen: false,\n    mobileMenuOpen: false,\n    postComposerOpen: false,\n    profileEditOpen: false,\n    isLoading: false,\n    loadingMessage: '',\n    searchQuery: '',\n    searchResults: [],\n    searchLoading: false,\n    toasts: [],\n    setSidebarOpen: jest.fn(),\n    setMobileMenuOpen: jest.fn(),\n    setPostComposerOpen: jest.fn(),\n    setProfileEditOpen: jest.fn(),\n    setLoading: jest.fn(),\n    addToast: jest.fn(),\n    removeToast: jest.fn(),\n    setSearchQuery: jest.fn(),\n    setSearchResults: jest.fn(),\n    setSearchLoading: jest.fn(),\n    clearSearch: jest.fn(),\n  }\n\n  beforeEach(() => {\n    jest.clearAllMocks()\n    mockUseSession.mockReturnValue({ data: mockSession, status: 'authenticated' })\n    mockUseFeedStore.mockReturnValue(defaultFeedStore)\n    mockUseUIStore.mockReturnValue(defaultUIStore)\n  })\n\n  it('should render feed with posts', async () => {\n    render(<EnhancedInteractiveFeed />)\n\n    await waitFor(() => {\n      expect(screen.getByText('First test post')).toBeInTheDocument()\n      expect(screen.getByText('Second test post with image')).toBeInTheDocument()\n    })\n\n    expect(screen.getByText('Author One')).toBeInTheDocument()\n    expect(screen.getByText('Author Two')).toBeInTheDocument()\n  })\n\n  it('should display loading state', () => {\n    mockUseFeedStore.mockReturnValue({\n      ...defaultFeedStore,\n      loading: true,\n      posts: [],\n    })\n\n    render(<EnhancedInteractiveFeed />)\n\n    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()\n  })\n\n  it('should display error state', () => {\n    const errorMessage = 'Failed to load posts'\n    mockUseFeedStore.mockReturnValue({\n      ...defaultFeedStore,\n      error: errorMessage,\n      posts: [],\n    })\n\n    render(<EnhancedInteractiveFeed />)\n\n    expect(screen.getByText(errorMessage)).toBeInTheDocument()\n    expect(screen.getByText('Try Again')).toBeInTheDocument()\n  })\n\n  it('should display empty state when no posts', () => {\n    mockUseFeedStore.mockReturnValue({\n      ...defaultFeedStore,\n      posts: [],\n      hasMore: false,\n    })\n\n    render(<EnhancedInteractiveFeed />)\n\n    expect(screen.getByText('No posts yet')).toBeInTheDocument()\n    expect(screen.getByText('Be the first to share something!')).toBeInTheDocument()\n  })\n\n  it('should handle feed type switching', async () => {\n    const user = userEvent.setup()\n    render(<EnhancedInteractiveFeed />)\n\n    const feedTypeSelect = screen.getByRole('combobox')\n    await user.click(feedTypeSelect)\n\n    const discoverOption = screen.getByText('Discover')\n    await user.click(discoverOption)\n\n    expect(defaultFeedStore.setFeedType).toHaveBeenCalledWith('discover')\n  })\n\n  it('should handle post liking', async () => {\n    const user = userEvent.setup()\n    render(<EnhancedInteractiveFeed />)\n\n    const likeButtons = screen.getAllByRole('button', { name: /like/i })\n    await user.click(likeButtons[0]) // Like first post\n\n    expect(defaultFeedStore.addOptimisticUpdate).toHaveBeenCalledWith(\n      'post-1',\n      expect.objectContaining({\n        type: 'like',\n        isLiked: true,\n      })\n    )\n  })\n\n  it('should handle post commenting', async () => {\n    const user = userEvent.setup()\n    render(<EnhancedInteractiveFeed />)\n\n    const commentButtons = screen.getAllByRole('button', { name: /comment/i })\n    await user.click(commentButtons[0])\n\n    const commentInput = screen.getByPlaceholderText('Write a comment...')\n    await user.type(commentInput, 'This is a test comment')\n\n    const submitButton = screen.getByRole('button', { name: /post comment/i })\n    await user.click(submitButton)\n\n    expect(defaultFeedStore.addOptimisticUpdate).toHaveBeenCalledWith(\n      'post-1',\n      expect.objectContaining({\n        type: 'comment',\n      })\n    )\n  })\n\n  it('should handle infinite scrolling', async () => {\n    const mockIntersectionObserver = jest.fn()\n    mockIntersectionObserver.mockReturnValue({\n      observe: () => null,\n      unobserve: () => null,\n      disconnect: () => null,\n    })\n    global.IntersectionObserver = mockIntersectionObserver\n\n    render(<EnhancedInteractiveFeed />)\n\n    // Simulate intersection observer callback\n    const [callback] = mockIntersectionObserver.mock.calls[0]\n    act(() => {\n      callback([{ isIntersecting: true }])\n    })\n\n    expect(defaultFeedStore.loadMorePosts).toHaveBeenCalled()\n  })\n\n  it('should handle pull-to-refresh', async () => {\n    const user = userEvent.setup()\n    render(<EnhancedInteractiveFeed />)\n\n    const feedContainer = screen.getByTestId('feed-container')\n    \n    // Simulate pull-to-refresh gesture\n    fireEvent.touchStart(feedContainer, {\n      touches: [{ clientY: 100 }],\n    })\n    \n    fireEvent.touchMove(feedContainer, {\n      touches: [{ clientY: 200 }],\n    })\n    \n    fireEvent.touchEnd(feedContainer)\n\n    await waitFor(() => {\n      expect(defaultFeedStore.refreshFeed).toHaveBeenCalled()\n    })\n  })\n\n  it('should display post composer when authenticated', () => {\n    render(<EnhancedInteractiveFeed />)\n\n    expect(screen.getByPlaceholderText(\"What's on your mind?\")).toBeInTheDocument()\n  })\n\n  it('should not display post composer when unauthenticated', () => {\n    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })\n\n    render(<EnhancedInteractiveFeed />)\n\n    expect(screen.queryByPlaceholderText(\"What's on your mind?\")).not.toBeInTheDocument()\n  })\n\n  it('should handle post creation', async () => {\n    const user = userEvent.setup()\n    render(<EnhancedInteractiveFeed />)\n\n    const postInput = screen.getByPlaceholderText(\"What's on your mind?\")\n    await user.click(postInput)\n\n    expect(defaultUIStore.setPostComposerOpen).toHaveBeenCalledWith(true)\n  })\n\n  it('should display optimistic updates', () => {\n    const optimisticUpdates = new Map([\n      ['post-1', {\n        type: 'like',\n        isLiked: true,\n        timestamp: Date.now(),\n      }],\n    ])\n\n    mockUseFeedStore.mockReturnValue({\n      ...defaultFeedStore,\n      optimisticUpdates,\n    })\n\n    render(<EnhancedInteractiveFeed />)\n\n    // The first post should show as liked due to optimistic update\n    const likeButtons = screen.getAllByRole('button', { name: /like/i })\n    expect(likeButtons[0]).toHaveClass('text-red-500') // Assuming liked state styling\n  })\n\n  it('should handle network errors gracefully', async () => {\n    const user = userEvent.setup()\n    mockUseFeedStore.mockReturnValue({\n      ...defaultFeedStore,\n      error: 'Network error',\n    })\n\n    render(<EnhancedInteractiveFeed />)\n\n    expect(screen.getByText('Network error')).toBeInTheDocument()\n    \n    const retryButton = screen.getByText('Try Again')\n    await user.click(retryButton)\n\n    expect(defaultFeedStore.refreshFeed).toHaveBeenCalled()\n  })\n\n  it('should handle real-time updates', () => {\n    const { rerender } = render(<EnhancedInteractiveFeed />)\n\n    // Simulate new post arriving via real-time update\n    const newPost = {\n      id: 'post-3',\n      content: 'New real-time post',\n      imageUrl: null,\n      createdAt: new Date().toISOString(),\n      updatedAt: new Date().toISOString(),\n      isPublic: true,\n      author: {\n        id: 'author-3',\n        username: 'author3',\n        name: 'Author Three',\n        image: null,\n      },\n      _count: {\n        likes: 0,\n        comments: 0,\n      },\n      isLiked: false,\n    }\n\n    mockUseFeedStore.mockReturnValue({\n      ...defaultFeedStore,\n      posts: [newPost, ...mockPosts],\n    })\n\n    rerender(<EnhancedInteractiveFeed />)\n\n    expect(screen.getByText('New real-time post')).toBeInTheDocument()\n  })\n\n  it('should handle keyboard navigation', async () => {\n    const user = userEvent.setup()\n    render(<EnhancedInteractiveFeed />)\n\n    const firstPost = screen.getByText('First test post').closest('[data-testid=\"post-item\"]')\n    \n    // Focus on first post\n    if (firstPost) {\n      firstPost.focus()\n      \n      // Navigate with arrow keys\n      await user.keyboard('{ArrowDown}')\n      \n      const secondPost = screen.getByText('Second test post with image').closest('[data-testid=\"post-item\"]')\n      expect(secondPost).toHaveFocus()\n    }\n  })\n\n  it('should handle accessibility features', () => {\n    render(<EnhancedInteractiveFeed />)\n\n    // Check for proper ARIA labels\n    expect(screen.getByRole('main')).toBeInTheDocument()\n    expect(screen.getByRole('feed')).toBeInTheDocument()\n    \n    // Check for screen reader announcements\n    const posts = screen.getAllByRole('article')\n    posts.forEach(post => {\n      expect(post).toHaveAttribute('aria-label')\n    })\n  })\n\n  it('should handle performance optimization', () => {\n    // Test virtualization for large lists\n    const manyPosts = Array.from({ length: 100 }, (_, i) => ({\n      ...mockPosts[0],\n      id: `post-${i}`,\n      content: `Post ${i}`,\n    }))\n\n    mockUseFeedStore.mockReturnValue({\n      ...defaultFeedStore,\n      posts: manyPosts,\n    })\n\n    render(<EnhancedInteractiveFeed />)\n\n    // Should only render visible posts (virtualization)\n    const renderedPosts = screen.getAllByRole('article')\n    expect(renderedPosts.length).toBeLessThan(manyPosts.length)\n  })\n\n  it('should handle feed filtering and sorting', async () => {\n    const user = userEvent.setup()\n    render(<EnhancedInteractiveFeed />)\n\n    // Test sorting options\n    const sortButton = screen.getByRole('button', { name: /sort/i })\n    await user.click(sortButton)\n\n    const popularOption = screen.getByText('Most Popular')\n    await user.click(popularOption)\n\n    expect(defaultFeedStore.setFeedType).toHaveBeenCalledWith('trending')\n  })\n\n  it('should handle post sharing', async () => {\n    const user = userEvent.setup()\n    \n    // Mock navigator.share\n    Object.assign(navigator, {\n      share: jest.fn().mockResolvedValue(undefined),\n    })\n\n    render(<EnhancedInteractiveFeed />)\n\n    const shareButtons = screen.getAllByRole('button', { name: /share/i })\n    await user.click(shareButtons[0])\n\n    expect(navigator.share).toHaveBeenCalledWith({\n      title: 'Post by Author One',\n      text: 'First test post',\n      url: expect.stringContaining('post-1'),\n    })\n  })\n})"
        : [31;1m     ^[0m
        `----


    Caused by:
        Syntax Error

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)

FAIL src/__tests__/api/posts.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/api/posts.test.ts'

    [0m [90m  7 |[39m [90m// Mock dependencies[39m
     [90m  8 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m  9 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m 10 |[39m   prisma[33m:[39m {
     [90m 11 |[39m     post[33m:[39m {
     [90m 12 |[39m       findMany[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/api/posts.test.ts:9:6)

FAIL src/__tests__/components/theme-toggle.test.tsx (9.94 s)
  ● ThemeToggle › should render theme toggle button

    TestingLibraryElementError: Unable to find an element by: [data-testid="sun-icon"]

    Ignored nodes: comments, script, style
    [36m<body>[39m
      [36m<div>[39m
        [36m<button[39m
          [33maria-expanded[39m=[32m"false"[39m
          [33maria-haspopup[39m=[32m"menu"[39m
          [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md h-9 w-9 px-0"[39m
          [33mdata-state[39m=[32m"closed"[39m
          [33mid[39m=[32m"radix-:r0:"[39m
          [33mtype[39m=[32m"button"[39m
        [36m>[39m
          [36m<svg[39m
            [33mclass[39m=[32m"lucide lucide-sun h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<circle[39m
              [33mcx[39m=[32m"12"[39m
              [33mcy[39m=[32m"12"[39m
              [33mr[39m=[32m"4"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M12 2v2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M12 20v2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m4.93 4.93 1.41 1.41"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m17.66 17.66 1.41 1.41"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M2 12h2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M20 12h2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m6.34 17.66-1.41 1.41"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m19.07 4.93-1.41 1.41"[39m
            [36m/>[39m
          [36m</svg>[39m
          [36m<svg[39m
            [33mclass[39m=[32m"lucide lucide-moon absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<path[39m
              [33md[39m=[32m"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"[39m
            [36m/>[39m
          [36m</svg>[39m
          [36m<span[39m
            [33mclass[39m=[32m"sr-only"[39m
          [36m>[39m
            [0mToggle theme[0m
          [36m</span>[39m
        [36m</button>[39m
      [36m</div>[39m
    [36m</body>[39m

    [0m [90m 22 |[39m
     [90m 23 |[39m     expect(screen[33m.[39mgetByRole([32m'button'[39m))[33m.[39mtoBeInTheDocument()
    [31m[1m>[22m[39m[90m 24 |[39m     expect(screen[33m.[39mgetByTestId([32m'sun-icon'[39m))[33m.[39mtoBeInTheDocument()
     [90m    |[39m                   [31m[1m^[22m[39m
     [90m 25 |[39m   })
     [90m 26 |[39m
     [90m 27 |[39m   it([32m'should show moon icon in dark theme'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.getElementError (node_modules/@testing-library/dom/dist/config.js:37:19)
      at node_modules/@testing-library/dom/dist/query-helpers.js:76:38
      at node_modules/@testing-library/dom/dist/query-helpers.js:52:17
      at node_modules/@testing-library/dom/dist/query-helpers.js:95:19
      at Object.getByTestId (src/__tests__/components/theme-toggle.test.tsx:24:19)

  ● ThemeToggle › should show moon icon in dark theme

    TestingLibraryElementError: Unable to find an element by: [data-testid="moon-icon"]

    Ignored nodes: comments, script, style
    [36m<body>[39m
      [36m<div>[39m
        [36m<button[39m
          [33maria-expanded[39m=[32m"false"[39m
          [33maria-haspopup[39m=[32m"menu"[39m
          [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md h-9 w-9 px-0"[39m
          [33mdata-state[39m=[32m"closed"[39m
          [33mid[39m=[32m"radix-:r2:"[39m
          [33mtype[39m=[32m"button"[39m
        [36m>[39m
          [36m<svg[39m
            [33mclass[39m=[32m"lucide lucide-sun h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<circle[39m
              [33mcx[39m=[32m"12"[39m
              [33mcy[39m=[32m"12"[39m
              [33mr[39m=[32m"4"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M12 2v2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M12 20v2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m4.93 4.93 1.41 1.41"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m17.66 17.66 1.41 1.41"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M2 12h2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M20 12h2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m6.34 17.66-1.41 1.41"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m19.07 4.93-1.41 1.41"[39m
            [36m/>[39m
          [36m</svg>[39m
          [36m<svg[39m
            [33mclass[39m=[32m"lucide lucide-moon absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<path[39m
              [33md[39m=[32m"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"[39m
            [36m/>[39m
          [36m</svg>[39m
          [36m<span[39m
            [33mclass[39m=[32m"sr-only"[39m
          [36m>[39m
            [0mToggle theme[0m
          [36m</span>[39m
        [36m</button>[39m
      [36m</div>[39m
    [36m</body>[39m

    [0m [90m 33 |[39m     render([33m<[39m[33mThemeToggle[39m [33m/[39m[33m>[39m)
     [90m 34 |[39m
    [31m[1m>[22m[39m[90m 35 |[39m     expect(screen[33m.[39mgetByTestId([32m'moon-icon'[39m))[33m.[39mtoBeInTheDocument()
     [90m    |[39m                   [31m[1m^[22m[39m
     [90m 36 |[39m   })
     [90m 37 |[39m
     [90m 38 |[39m   it([32m'should toggle to dark theme when clicked in light mode'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.getElementError (node_modules/@testing-library/dom/dist/config.js:37:19)
      at node_modules/@testing-library/dom/dist/query-helpers.js:76:38
      at node_modules/@testing-library/dom/dist/query-helpers.js:52:17
      at node_modules/@testing-library/dom/dist/query-helpers.js:95:19
      at Object.getByTestId (src/__tests__/components/theme-toggle.test.tsx:35:19)

  ● ThemeToggle › should toggle to dark theme when clicked in light mode

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "dark"

    Number of calls: 0

    [0m [90m 48 |[39m     fireEvent[33m.[39mclick(button)
     [90m 49 |[39m
    [31m[1m>[22m[39m[90m 50 |[39m     expect(mockSetTheme)[33m.[39mtoHaveBeenCalledWith([32m'dark'[39m)
     [90m    |[39m                          [31m[1m^[22m[39m
     [90m 51 |[39m   })
     [90m 52 |[39m
     [90m 53 |[39m   it([32m'should toggle to light theme when clicked in dark mode'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.toHaveBeenCalledWith (src/__tests__/components/theme-toggle.test.tsx:50:26)

  ● ThemeToggle › should toggle to light theme when clicked in dark mode

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "light"

    Number of calls: 0

    [0m [90m 63 |[39m     fireEvent[33m.[39mclick(button)
     [90m 64 |[39m
    [31m[1m>[22m[39m[90m 65 |[39m     expect(mockSetTheme)[33m.[39mtoHaveBeenCalledWith([32m'light'[39m)
     [90m    |[39m                          [31m[1m^[22m[39m
     [90m 66 |[39m   })
     [90m 67 |[39m
     [90m 68 |[39m   it([32m'should handle system theme'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.toHaveBeenCalledWith (src/__tests__/components/theme-toggle.test.tsx:65:26)

  ● ThemeToggle › should have proper accessibility attributes

    expect(element).toHaveAttribute("aria-label", StringContaining "theme") // element.getAttribute("aria-label") === StringContaining "theme"

    Expected the element to have attribute:
      aria-label=StringContaining "theme"
    Received:
      null

    [0m [90m 86 |[39m
     [90m 87 |[39m     [36mconst[39m button [33m=[39m screen[33m.[39mgetByRole([32m'button'[39m)
    [31m[1m>[22m[39m[90m 88 |[39m     expect(button)[33m.[39mtoHaveAttribute([32m'aria-label'[39m[33m,[39m expect[33m.[39mstringContaining([32m'theme'[39m))
     [90m    |[39m                    [31m[1m^[22m[39m
     [90m 89 |[39m   })
     [90m 90 |[39m
     [90m 91 |[39m   it([32m'should apply custom className when provided'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.toHaveAttribute (src/__tests__/components/theme-toggle.test.tsx:88:20)

  ● ThemeToggle › should apply custom className when provided

    expect(element).toHaveClass("custom-class")

    Expected the element to have class:
      custom-class
    Received:
      inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md h-9 w-9 px-0

    [0m [90m  98 |[39m
     [90m  99 |[39m     [36mconst[39m button [33m=[39m screen[33m.[39mgetByRole([32m'button'[39m)
    [31m[1m>[22m[39m[90m 100 |[39m     expect(button)[33m.[39mtoHaveClass([32m'custom-class'[39m)
     [90m     |[39m                    [31m[1m^[22m[39m
     [90m 101 |[39m   })
     [90m 102 |[39m
     [90m 103 |[39m   it([32m'should handle undefined theme gracefully'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.toHaveClass (src/__tests__/components/theme-toggle.test.tsx:100:20)

FAIL src/__tests__/api/users.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/db' from 'src/__tests__/api/users.test.ts'

    [0m [90m  6 |[39m [90m// Mock dependencies[39m
     [90m  7 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m  8 |[39m jest[33m.[39mmock([32m'@/lib/db'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m  9 |[39m   prisma[33m:[39m {
     [90m 10 |[39m     user[33m:[39m {
     [90m 11 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/api/users.test.ts:8:6)

FAIL src/__tests__/api/notifications.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/api/notifications.test.ts'

    [0m [90m  7 |[39m [90m// Mock dependencies[39m
     [90m  8 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m  9 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m 10 |[39m   prisma[33m:[39m {
     [90m 11 |[39m     notification[33m:[39m {
     [90m 12 |[39m       findMany[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/api/notifications.test.ts:9:6)

FAIL src/__tests__/components/post-item.test.tsx (10.385 s)
  ● PostItem › should handle bookmark action

    TestingLibraryElementError: Found multiple elements with the role "button" and name ""

    Here are the matching elements:

    Ignored nodes: comments, script, style
    [36m<button[39m
      [33maria-expanded[39m=[32m"false"[39m
      [33maria-haspopup[39m=[32m"menu"[39m
      [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0"[39m
      [33mdata-state[39m=[32m"closed"[39m
      [33mid[39m=[32m"radix-:ra:"[39m
      [33mtype[39m=[32m"button"[39m
    [36m>[39m
      [36m<svg[39m
        [33mclass[39m=[32m"lucide lucide-ellipsis h-4 w-4"[39m
        [33mfill[39m=[32m"none"[39m
        [33mheight[39m=[32m"24"[39m
        [33mstroke[39m=[32m"currentColor"[39m
        [33mstroke-linecap[39m=[32m"round"[39m
        [33mstroke-linejoin[39m=[32m"round"[39m
        [33mstroke-width[39m=[32m"2"[39m
        [33mviewBox[39m=[32m"0 0 24 24"[39m
        [33mwidth[39m=[32m"24"[39m
        [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
      [36m>[39m
        [36m<circle[39m
          [33mcx[39m=[32m"12"[39m
          [33mcy[39m=[32m"12"[39m
          [33mr[39m=[32m"1"[39m
        [36m/>[39m
        [36m<circle[39m
          [33mcx[39m=[32m"19"[39m
          [33mcy[39m=[32m"12"[39m
          [33mr[39m=[32m"1"[39m
        [36m/>[39m
        [36m<circle[39m
          [33mcx[39m=[32m"5"[39m
          [33mcy[39m=[32m"12"[39m
          [33mr[39m=[32m"1"[39m
        [36m/>[39m
      [36m</svg>[39m
    [36m</button>[39m

    Ignored nodes: comments, script, style
    [36m<button[39m
      [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 text-muted-foreground hover:text-yellow-500"[39m
    [36m>[39m
      [36m<svg[39m
        [33mclass[39m=[32m"lucide lucide-bookmark h-4 w-4"[39m
        [33mfill[39m=[32m"none"[39m
        [33mheight[39m=[32m"24"[39m
        [33mstroke[39m=[32m"currentColor"[39m
        [33mstroke-linecap[39m=[32m"round"[39m
        [33mstroke-linejoin[39m=[32m"round"[39m
        [33mstroke-width[39m=[32m"2"[39m
        [33mviewBox[39m=[32m"0 0 24 24"[39m
        [33mwidth[39m=[32m"24"[39m
        [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
      [36m>[39m
        [36m<path[39m
          [33md[39m=[32m"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"[39m
        [36m/>[39m
      [36m</svg>[39m
    [36m</button>[39m

    (If this is intentional, then use the `*AllBy*` variant of the query (like `queryAllByText`, `getAllByText`, or `findAllByText`)).

    Ignored nodes: comments, script, style
    [36m<body>[39m
      [36m<div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"rounded-lg border bg-card text-card-foreground shadow-sm w-full"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"flex flex-col space-y-1.5 p-6 pb-3"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"flex items-start justify-between"[39m
            [36m>[39m
              [36m<a[39m
                [33mclass[39m=[32m"hover:opacity-80 transition-opacity"[39m
                [33mhref[39m=[32m"/profile/postauthor"[39m
              [36m>[39m
                [36m<div[39m
                  [33mclass[39m=[32m"flex items-center gap-2"[39m
                [36m>[39m
                  [36m<span[39m
                    [33mclass[39m=[32m"relative flex shrink-0 overflow-hidden rounded-full h-8 w-8"[39m
                  [36m>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"flex h-full w-full items-center justify-center rounded-full bg-muted text-sm"[39m
                    [36m>[39m
                      [0mPA[0m
                    [36m</span>[39m
                  [36m</span>[39m
                  [36m<div[39m
                    [33mclass[39m=[32m"flex flex-col min-w-0"[39m
                  [36m>[39m
                    [36m<div[39m
                      [33mclass[39m=[32m"flex items-center gap-2"[39m
                    [36m>[39m
                      [36m<span[39m
                        [33mclass[39m=[32m"font-medium truncate text-base"[39m
                      [36m>[39m
                        [0mPost Author[0m
                      [36m</span>[39m
                    [36m</div>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-muted-foreground truncate text-sm"[39m
                    [36m>[39m
                      [0m@[0m
                      [0mpostauthor[0m
                    [36m</span>[39m
                  [36m</div>[39m
                [36m</div>[39m
              [36m</a>[39m
              [36m<div[39m
                [33mclass[39m=[32m"flex items-center gap-2"[39m
              [36m>[39m
                [36m<span[39m
                  [33mclass[39m=[32m"text-sm text-muted-foreground"[39m
                [36m>[39m
                  [0mJanuary 1, 2024[0m
                [36m</span>[39m
                [36m<button[39m
                  [33maria-expanded[39m=[32m"false"[39m
                  [33maria-haspopup[39m=[32m"menu"[39m
                  [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0"[39m
                  [33mdata-state[39m=[32m"closed"[39m
                  [33mid[39m=[32m"radix-:ra:"[39m
                  [33mtype[39m=[32m"button"[39m
                [36m>[39m
                  [36m<svg[39m
                    [33mclass[39m=[32m"lucide lucide-ellipsis h-4 w-4"[39m
                    [33mfill[39m=[32m"none"[39m
                    [33mheight[39m=[32m"24"[39m
                    [33mstroke[39m=[32m"currentColor"[39m
                    [33mstroke-linecap[39m=[32m"round"[39m
                    [33mstroke-linejoin[39m=[32m"round"[39m
                    [33mstroke-width[39m=[32m"2"[39m
                    [33mviewBox[39m=[32m"0 0 24 24"[39m
                    [33mwidth[39m=[32m"24"[39m
                    [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                  [36m>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"12"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"19"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"5"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                  [36m</svg>[39m
                [36m</button>[39m
              [36m</div>[39m
            [36m</div>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"p-6 pt-0"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"space-y-3"[39m
            [36m>[39m
              [36m<div[39m
                [33mclass[39m=[32m"text-sm leading-relaxed whitespace-pre-wrap"[39m
              [36m>[39m
                [0mThis is a test post content[0m
              [36m</div>[39m
              [36m<div[39m
                [33mclass[39m=[32m"flex items-center justify-between pt-2 border-t"[39m
              [36m>[39m
                [36m<div[39m
                  [33mclass[39m=[32m"flex items-center gap-4"[39m
                [36m>[39m
                  [36m<button[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-red-500"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-heart h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0m5[0m
                    [36m</span>[39m
                  [36m</button>[39m
                  [36m<a[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-blue-500"[39m
                    [33mhref[39m=[32m"/post/post-1"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-message-circle h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M7.9 20A9 9 0 1 0 4 16.1L2 22Z"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0m3[0m
                    [36m</span>[39m
                  [36m</a>[39m
                  [36m<button[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-green-500"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-share h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"[39m
                      [36m/>[39m
                      [36m<polyline[39m
                        [33mpoints[39m=[32m"16 6 12 2 8 6"[39m
                      [36m/>[39m
                      [36m<line[39m
                        [33mx1[39m=[32m"12"[39m
                        [33mx2[39m=[32m"12"[39m
                        [33my1[39m=[32m"2"[39m
                        [33my2[39m=[32m"15"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0mShare[0m
                    [36m</span>[39m
                  [36m</button>[39m
                [36m</div>[39m
                [36m<button[39m
                  [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 text-muted-foreground hover:text-yellow-500"[39m
                [36m>[39m
                  [36m<svg[39m
                    [33mclass[39m=[32m"lucide lucide-bookmark h-4 w-4"[39m
                    [33mfill[39m=[32m"none"[39m
                    [33mheight[39m=[32m"24"[39m
                    [33mstroke[39m=[32m"currentColor"[39m
                    [33mstroke-linecap[39m=[32m"round"[39m
                    [33mstroke-linejoin[39m=[32m"round"[39m
                    [33mstroke-width[39m=[32m"2"[39m
                    [33mviewBox[39m=[32m"0 0 24 24"[39m
                    [33mwidth[39m=[32m"24"[39m
                    [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                  [36m>[39m
                    [36m<path[39m
                      [33md[39m=[32m"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"[39m
                    [36m/>[39m
                  [36m</svg>[39m
                [36m</button>[39m
              [36m</div>[39m
            [36m</div>[39m
          [36m</div>[39m
        [36m</div>[39m
      [36m</div>[39m
    [36m</body>[39m

    [0m [90m 70 |[39m     render([33m<[39m[33mPostItem[39m post[33m=[39m{mockPost} onBookmark[33m=[39m{mockOnBookmark} [33m/[39m[33m>[39m)
     [90m 71 |[39m
    [31m[1m>[22m[39m[90m 72 |[39m     [36mconst[39m bookmarkButton [33m=[39m screen[33m.[39mgetByRole([32m'button'[39m[33m,[39m { name[33m:[39m [32m''[39m })[33m.[39mclosest([32m'button'[39m)
     [90m    |[39m                                   [31m[1m^[22m[39m
     [90m 73 |[39m     [90m// Find the bookmark button (last button without text)[39m
     [90m 74 |[39m     [36mconst[39m buttons [33m=[39m screen[33m.[39mgetAllByRole([32m'button'[39m)
     [90m 75 |[39m     [36mconst[39m bookmarkBtn [33m=[39m buttons[buttons[33m.[39mlength [33m-[39m [35m1[39m][0m

      at Object.getElementError (node_modules/@testing-library/dom/dist/config.js:37:19)
      at getElementError (node_modules/@testing-library/dom/dist/query-helpers.js:20:35)
      at getMultipleElementsFoundError (node_modules/@testing-library/dom/dist/query-helpers.js:23:10)
      at node_modules/@testing-library/dom/dist/query-helpers.js:55:13
      at node_modules/@testing-library/dom/dist/query-helpers.js:95:19
      at Object.getByRole (src/__tests__/components/post-item.test.tsx:72:35)

  ● PostItem › should show delete option for post author

    TestingLibraryElementError: Unable to find an element with the text: Delete post. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

    Ignored nodes: comments, script, style
    [36m<body>[39m
      [36m<div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"rounded-lg border bg-card text-card-foreground shadow-sm w-full"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"flex flex-col space-y-1.5 p-6 pb-3"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"flex items-start justify-between"[39m
            [36m>[39m
              [36m<a[39m
                [33mclass[39m=[32m"hover:opacity-80 transition-opacity"[39m
                [33mhref[39m=[32m"/profile/postauthor"[39m
              [36m>[39m
                [36m<div[39m
                  [33mclass[39m=[32m"flex items-center gap-2"[39m
                [36m>[39m
                  [36m<span[39m
                    [33mclass[39m=[32m"relative flex shrink-0 overflow-hidden rounded-full h-8 w-8"[39m
                  [36m>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"flex h-full w-full items-center justify-center rounded-full bg-muted text-sm"[39m
                    [36m>[39m
                      [0mPA[0m
                    [36m</span>[39m
                  [36m</span>[39m
                  [36m<div[39m
                    [33mclass[39m=[32m"flex flex-col min-w-0"[39m
                  [36m>[39m
                    [36m<div[39m
                      [33mclass[39m=[32m"flex items-center gap-2"[39m
                    [36m>[39m
                      [36m<span[39m
                        [33mclass[39m=[32m"font-medium truncate text-base"[39m
                      [36m>[39m
                        [0mPost Author[0m
                      [36m</span>[39m
                    [36m</div>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-muted-foreground truncate text-sm"[39m
                    [36m>[39m
                      [0m@[0m
                      [0mpostauthor[0m
                    [36m</span>[39m
                  [36m</div>[39m
                [36m</div>[39m
              [36m</a>[39m
              [36m<div[39m
                [33mclass[39m=[32m"flex items-center gap-2"[39m
              [36m>[39m
                [36m<span[39m
                  [33mclass[39m=[32m"text-sm text-muted-foreground"[39m
                [36m>[39m
                  [0mJanuary 1, 2024[0m
                [36m</span>[39m
                [36m<button[39m
                  [33maria-expanded[39m=[32m"false"[39m
                  [33maria-haspopup[39m=[32m"menu"[39m
                  [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0"[39m
                  [33mdata-state[39m=[32m"closed"[39m
                  [33mid[39m=[32m"radix-:ri:"[39m
                  [33mtype[39m=[32m"button"[39m
                [36m>[39m
                  [36m<svg[39m
                    [33mclass[39m=[32m"lucide lucide-ellipsis h-4 w-4"[39m
                    [33mfill[39m=[32m"none"[39m
                    [33mheight[39m=[32m"24"[39m
                    [33mstroke[39m=[32m"currentColor"[39m
                    [33mstroke-linecap[39m=[32m"round"[39m
                    [33mstroke-linejoin[39m=[32m"round"[39m
                    [33mstroke-width[39m=[32m"2"[39m
                    [33mviewBox[39m=[32m"0 0 24 24"[39m
                    [33mwidth[39m=[32m"24"[39m
                    [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                  [36m>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"12"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"19"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"5"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                  [36m</svg>[39m
                [36m</button>[39m
              [36m</div>[39m
            [36m</div>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"p-6 pt-0"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"space-y-3"[39m
            [36m>[39m
              [36m<div[39m
                [33mclass[39m=[32m"text-sm leading-relaxed whitespace-pre-wrap"[39m
              [36m>[39m
                [0mThis is a test post content[0m
              [36m</div>[39m
              [36m<div[39m
                [33mclass[39m=[32m"flex items-center justify-between pt-2 border-t"[39m
              [36m>[39m
                [36m<div[39m
                  [33mclass[39m=[32m"flex items-center gap-4"[39m
                [36m>[39m
                  [36m<button[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-red-500"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-heart h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0m5[0m
                    [36m</span>[39m
                  [36m</button>[39m
                  [36m<a[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-blue-500"[39m
                    [33mhref[39m=[32m"/post/post-1"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-message-circle h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M7.9 20A9 9 0 1 0 4 16.1L2 22Z"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0m3[0m
                    [36m</span>[39m
                  [36m</a>[39m
                  [36m<button[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-green-500"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-share h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"[39m
                      [36m/>[39m
                      [36m<polyline[39m
                        [33mpoints[39m=[32m"16 6 12 2 8 6"[39m
                      [36m/>[39m
                      [36m<line[39m
                        [33mx1[39m=[32m"12"[39m
                        [33mx2[39m=[32m"12"[39m
                        [33my1[39m=[32m"2"[39m
                        [33my2[39m=[32m"15"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0mShare[0m
                    [36m</span>[39m
                  [36m</button>[39m
                [36m</div>[39m
                [36m<button[39m
                  [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 text-muted-foreground hover:text-yellow-500"[39m
                [36m>[39m
                  [36m<svg[39m
                    [33mclass[39m=[32m"lucide lucide-bookmark h-4 w-4"[39m
                    [33mfill[39m=[32m"none"[39m
                    [33mheight[39m=[32m"24"[39m
                    [33mstroke[39m=[32m"currentColor"[39m
                    [33mstroke-linecap[39m=[32m"round"[39m
                    [33mstroke-linejoin[39m=[32m"round"[39m
                    [33mstroke-width[39m=[32m"2"[39m
                    [33mviewBox[39m=[32m"0 0 24 24"[39m
                    [33mwidth[39m=[32m"24"[39m
                    [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                  [36m>[39m
                    [36m<path[39m
                      [33md[39m=[32m"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"[39m
                    [36m/>[39m
                  [36m</svg>[39m
                [36m</button>[39m
              [36m</div>[39m
            [36m</div>[39m
          [36m</div>[39m
        [36m</div>[39m
      [36m</div>[39m
    [36m</body>[39m

    [0m [90m 108 |[39m     fireEvent[33m.[39mclick(dropdownTrigger)
     [90m 109 |[39m
    [31m[1m>[22m[39m[90m 110 |[39m     expect(screen[33m.[39mgetByText([32m'Delete post'[39m))[33m.[39mtoBeInTheDocument()
     [90m     |[39m                   [31m[1m^[22m[39m
     [90m 111 |[39m   })
     [90m 112 |[39m
     [90m 113 |[39m   it([32m'should show report option for other users'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.getElementError (node_modules/@testing-library/dom/dist/config.js:37:19)
      at node_modules/@testing-library/dom/dist/query-helpers.js:76:38
      at node_modules/@testing-library/dom/dist/query-helpers.js:52:17
      at node_modules/@testing-library/dom/dist/query-helpers.js:95:19
      at Object.getByText (src/__tests__/components/post-item.test.tsx:110:19)

  ● PostItem › should show report option for other users

    TestingLibraryElementError: Unable to find an element with the text: Report post. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

    Ignored nodes: comments, script, style
    [36m<body>[39m
      [36m<div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"rounded-lg border bg-card text-card-foreground shadow-sm w-full"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"flex flex-col space-y-1.5 p-6 pb-3"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"flex items-start justify-between"[39m
            [36m>[39m
              [36m<a[39m
                [33mclass[39m=[32m"hover:opacity-80 transition-opacity"[39m
                [33mhref[39m=[32m"/profile/postauthor"[39m
              [36m>[39m
                [36m<div[39m
                  [33mclass[39m=[32m"flex items-center gap-2"[39m
                [36m>[39m
                  [36m<span[39m
                    [33mclass[39m=[32m"relative flex shrink-0 overflow-hidden rounded-full h-8 w-8"[39m
                  [36m>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"flex h-full w-full items-center justify-center rounded-full bg-muted text-sm"[39m
                    [36m>[39m
                      [0mPA[0m
                    [36m</span>[39m
                  [36m</span>[39m
                  [36m<div[39m
                    [33mclass[39m=[32m"flex flex-col min-w-0"[39m
                  [36m>[39m
                    [36m<div[39m
                      [33mclass[39m=[32m"flex items-center gap-2"[39m
                    [36m>[39m
                      [36m<span[39m
                        [33mclass[39m=[32m"font-medium truncate text-base"[39m
                      [36m>[39m
                        [0mPost Author[0m
                      [36m</span>[39m
                    [36m</div>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-muted-foreground truncate text-sm"[39m
                    [36m>[39m
                      [0m@[0m
                      [0mpostauthor[0m
                    [36m</span>[39m
                  [36m</div>[39m
                [36m</div>[39m
              [36m</a>[39m
              [36m<div[39m
                [33mclass[39m=[32m"flex items-center gap-2"[39m
              [36m>[39m
                [36m<span[39m
                  [33mclass[39m=[32m"text-sm text-muted-foreground"[39m
                [36m>[39m
                  [0mJanuary 1, 2024[0m
                [36m</span>[39m
                [36m<button[39m
                  [33maria-expanded[39m=[32m"false"[39m
                  [33maria-haspopup[39m=[32m"menu"[39m
                  [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0"[39m
                  [33mdata-state[39m=[32m"closed"[39m
                  [33mid[39m=[32m"radix-:rk:"[39m
                  [33mtype[39m=[32m"button"[39m
                [36m>[39m
                  [36m<svg[39m
                    [33mclass[39m=[32m"lucide lucide-ellipsis h-4 w-4"[39m
                    [33mfill[39m=[32m"none"[39m
                    [33mheight[39m=[32m"24"[39m
                    [33mstroke[39m=[32m"currentColor"[39m
                    [33mstroke-linecap[39m=[32m"round"[39m
                    [33mstroke-linejoin[39m=[32m"round"[39m
                    [33mstroke-width[39m=[32m"2"[39m
                    [33mviewBox[39m=[32m"0 0 24 24"[39m
                    [33mwidth[39m=[32m"24"[39m
                    [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                  [36m>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"12"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"19"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"5"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                  [36m</svg>[39m
                [36m</button>[39m
              [36m</div>[39m
            [36m</div>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"p-6 pt-0"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"space-y-3"[39m
            [36m>[39m
              [36m<div[39m
                [33mclass[39m=[32m"text-sm leading-relaxed whitespace-pre-wrap"[39m
              [36m>[39m
                [0mThis is a test post content[0m
              [36m</div>[39m
              [36m<div[39m
                [33mclass[39m=[32m"flex items-center justify-between pt-2 border-t"[39m
              [36m>[39m
                [36m<div[39m
                  [33mclass[39m=[32m"flex items-center gap-4"[39m
                [36m>[39m
                  [36m<button[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-red-500"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-heart h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0m5[0m
                    [36m</span>[39m
                  [36m</button>[39m
                  [36m<a[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-blue-500"[39m
                    [33mhref[39m=[32m"/post/post-1"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-message-circle h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M7.9 20A9 9 0 1 0 4 16.1L2 22Z"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0m3[0m
                    [36m</span>[39m
                  [36m</a>[39m
                  [36m<button[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-green-500"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-share h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"[39m
                      [36m/>[39m
                      [36m<polyline[39m
                        [33mpoints[39m=[32m"16 6 12 2 8 6"[39m
                      [36m/>[39m
                      [36m<line[39m
                        [33mx1[39m=[32m"12"[39m
                        [33mx2[39m=[32m"12"[39m
                        [33my1[39m=[32m"2"[39m
                        [33my2[39m=[32m"15"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0mShare[0m
                    [36m</span>[39m
                  [36m</button>[39m
                [36m</div>[39m
                [36m<button[39m
                  [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 text-muted-foreground hover:text-yellow-500"[39m
                [36m>[39m
                  [36m<svg[39m
                    [33mclass[39m=[32m"lucide lucide-bookmark h-4 w-4"[39m
                    [33mfill[39m=[32m"none"[39m
                    [33mheight[39m=[32m"24"[39m
                    [33mstroke[39m=[32m"currentColor"[39m
                    [33mstroke-linecap[39m=[32m"round"[39m
                    [33mstroke-linejoin[39m=[32m"round"[39m
                    [33mstroke-width[39m=[32m"2"[39m
                    [33mviewBox[39m=[32m"0 0 24 24"[39m
                    [33mwidth[39m=[32m"24"[39m
                    [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                  [36m>[39m
                    [36m<path[39m
                      [33md[39m=[32m"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"[39m
                    [36m/>[39m
                  [36m</svg>[39m
                [36m</button>[39m
              [36m</div>[39m
            [36m</div>[39m
          [36m</div>[39m
        [36m</div>[39m
      [36m</div>[39m
    [36m</body>[39m

    [0m [90m 117 |[39m     fireEvent[33m.[39mclick(dropdownTrigger)
     [90m 118 |[39m
    [31m[1m>[22m[39m[90m 119 |[39m     expect(screen[33m.[39mgetByText([32m'Report post'[39m))[33m.[39mtoBeInTheDocument()
     [90m     |[39m                   [31m[1m^[22m[39m
     [90m 120 |[39m   })
     [90m 121 |[39m
     [90m 122 |[39m   it([32m'should update like count when liked'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.getElementError (node_modules/@testing-library/dom/dist/config.js:37:19)
      at node_modules/@testing-library/dom/dist/query-helpers.js:76:38
      at node_modules/@testing-library/dom/dist/query-helpers.js:52:17
      at node_modules/@testing-library/dom/dist/query-helpers.js:95:19
      at Object.getByText (src/__tests__/components/post-item.test.tsx:119:19)

  ● PostItem › should apply custom className

    expect(element).toHaveClass("custom-class")

    Expected the element to have class:
      custom-class
    Received:
      flex flex-col space-y-1.5 p-6 pb-3

    [0m [90m 133 |[39m     [36mconst[39m { container } [33m=[39m render([33m<[39m[33mPostItem[39m post[33m=[39m{mockPost} className[33m=[39m[32m"custom-class"[39m [33m/[39m[33m>[39m)
     [90m 134 |[39m     
    [31m[1m>[22m[39m[90m 135 |[39m     expect(container[33m.[39mfirstChild[33m?[39m[33m.[39mfirstChild)[33m.[39mtoHaveClass([32m'custom-class'[39m)
     [90m     |[39m                                              [31m[1m^[22m[39m
     [90m 136 |[39m   })
     [90m 137 |[39m })[0m

      at Object.toHaveClass (src/__tests__/components/post-item.test.tsx:135:46)

FAIL src/__tests__/api/comments.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/api/comments.test.ts'

    [0m [90m  8 |[39m [90m// Mock dependencies[39m
     [90m  9 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m 10 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m 11 |[39m   prisma[33m:[39m {
     [90m 12 |[39m     post[33m:[39m {
     [90m 13 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/api/comments.test.ts:10:6)

FAIL src/__tests__/api/follow.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/api/follow.test.ts'

    [0m [90m  9 |[39m [90m// Mock dependencies[39m
     [90m 10 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m 11 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m 12 |[39m   prisma[33m:[39m {
     [90m 13 |[39m     user[33m:[39m {
     [90m 14 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/api/follow.test.ts:11:6)

PASS src/__tests__/components/post-composer.test.tsx (10.788 s)
  ● Console

    console.error
      Failed to create post: Error: Network error
          at Object.<anonymous> (C:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\components\post-composer.test.tsx:72:54)
          at Promise.then.completed (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\utils.js:231:10)
          at _callCircusTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:316:40)
          at _runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:252:3)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:126:9)
          at _runTestsForDescribeBlock (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:121:9)
          at run (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\run.js:71:3)
          at runAndTransformResultsToJestFormat (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapterInit.js:122:21)
          at jestAdapter (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-circus\build\legacy-code-todo-rewrite\jestAdapter.js:79:19)
          at runTestInternal (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:367:16)
          at runTest (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\runTest.js:444:34)
          at Object.worker (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\jest-runner\build\testWorker.js:106:12)

    [0m [90m 58 |[39m       setShowImageInput([36mfalse[39m)
     [90m 59 |[39m     } [36mcatch[39m (error) {
    [31m[1m>[22m[39m[90m 60 |[39m       console[33m.[39merror([32m'Failed to create post:'[39m[33m,[39m error)
     [90m    |[39m               [31m[1m^[22m[39m
     [90m 61 |[39m     } [36mfinally[39m {
     [90m 62 |[39m       setIsSubmitting([36mfalse[39m)
     [90m 63 |[39m     }[0m

      at error (src/components/ui/post-composer.tsx:60:15)

FAIL src/__tests__/api/likes.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/api/likes.test.ts'

    [0m [90m  7 |[39m [90m// Mock dependencies[39m
     [90m  8 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m  9 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m 10 |[39m   prisma[33m:[39m {
     [90m 11 |[39m     post[33m:[39m {
     [90m 12 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/api/likes.test.ts:9:6)

FAIL src/__tests__/api/auth-register.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/db' from 'src/__tests__/api/auth-register.test.ts'

    [0m [90m  5 |[39m
     [90m  6 |[39m [90m// Mock dependencies[39m
    [31m[1m>[22m[39m[90m  7 |[39m jest[33m.[39mmock([32m'@/lib/db'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m  8 |[39m   prisma[33m:[39m {
     [90m  9 |[39m     user[33m:[39m {
     [90m 10 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/api/auth-register.test.ts:7:6)

FAIL src/__tests__/hooks/use-notifications.test.ts (11.826 s)
  ● useNotifications › should mark notification as read

    TypeError: result.current.markAsRead is not a function

    Ignored nodes: comments, script, style
    [36m<html>[39m
      [36m<head />[39m
      [36m<body>[39m
        [36m<div />[39m
      [36m</body>[39m
    [36m</html>[39m

    [0m [90m 125 |[39m
     [90m 126 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
    [31m[1m>[22m[39m[90m 127 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mmarkAsRead([32m'notification-1'[39m)
     [90m     |[39m                            [31m[1m^[22m[39m
     [90m 128 |[39m     })
     [90m 129 |[39m
     [90m 130 |[39m     expect(global[33m.[39mfetch)[33m.[39mtoHaveBeenCalledWith([32m'/api/notifications/notification-1'[39m[33m,[39m {[0m

      at markAsRead (src/__tests__/hooks/use-notifications.test.ts:127:28)
      at runWithExpensiveErrorDiagnosticsDisabled (node_modules/@testing-library/dom/dist/config.js:47:12)
      at checkCallback (node_modules/@testing-library/dom/dist/wait-for.js:124:77)
      at checkRealTimersCallback (node_modules/@testing-library/dom/dist/wait-for.js:118:16)
      at Timeout.task [as _onTimeout] (node_modules/jsdom/lib/jsdom/browser/Window.js:520:19)

  ● useNotifications › should mark all notifications as read

    TypeError: result.current.markAllAsRead is not a function

    Ignored nodes: comments, script, style
    [36m<html>[39m
      [36m<head />[39m
      [36m<body>[39m
        [36m<div />[39m
      [36m</body>[39m
    [36m</html>[39m

    [0m [90m 154 |[39m
     [90m 155 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
    [31m[1m>[22m[39m[90m 156 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mmarkAllAsRead()
     [90m     |[39m                            [31m[1m^[22m[39m
     [90m 157 |[39m     })
     [90m 158 |[39m
     [90m 159 |[39m     expect(global[33m.[39mfetch)[33m.[39mtoHaveBeenCalledWith([32m'/api/notifications'[39m[33m,[39m {[0m

      at markAllAsRead (src/__tests__/hooks/use-notifications.test.ts:156:28)
      at runWithExpensiveErrorDiagnosticsDisabled (node_modules/@testing-library/dom/dist/config.js:47:12)
      at checkCallback (node_modules/@testing-library/dom/dist/wait-for.js:124:77)
      at checkRealTimersCallback (node_modules/@testing-library/dom/dist/wait-for.js:118:16)
      at Timeout.task [as _onTimeout] (node_modules/jsdom/lib/jsdom/browser/Window.js:520:19)

  ● useNotifications › should handle mark as read error

    TypeError: result.current.markAsRead is not a function

    [0m [90m 179 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useNotifications())
     [90m 180 |[39m
    [31m[1m>[22m[39m[90m 181 |[39m     [36mawait[39m expect(result[33m.[39mcurrent[33m.[39mmarkAsRead([32m'notification-1'[39m))[33m.[39mrejects[33m.[39mtoThrow([32m'Network error'[39m)
     [90m     |[39m                                 [31m[1m^[22m[39m
     [90m 182 |[39m   })
     [90m 183 |[39m
     [90m 184 |[39m   it([32m'should delete notification'[39m[33m,[39m [36masync[39m () [33m=>[39m {[0m

      at Object.markAsRead (src/__tests__/hooks/use-notifications.test.ts:181:33)

  ● useNotifications › should delete notification

    TypeError: result.current.deleteNotification is not a function

    Ignored nodes: comments, script, style
    [36m<html>[39m
      [36m<head />[39m
      [36m<body>[39m
        [36m<div />[39m
      [36m</body>[39m
    [36m</html>[39m

    [0m [90m 199 |[39m
     [90m 200 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
    [31m[1m>[22m[39m[90m 201 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mdeleteNotification([32m'notification-1'[39m)
     [90m     |[39m                            [31m[1m^[22m[39m
     [90m 202 |[39m     })
     [90m 203 |[39m
     [90m 204 |[39m     expect(global[33m.[39mfetch)[33m.[39mtoHaveBeenCalledWith([32m'/api/notifications/notification-1'[39m[33m,[39m {[0m

      at deleteNotification (src/__tests__/hooks/use-notifications.test.ts:201:28)
      at runWithExpensiveErrorDiagnosticsDisabled (node_modules/@testing-library/dom/dist/config.js:47:12)
      at checkCallback (node_modules/@testing-library/dom/dist/wait-for.js:124:77)
      at checkRealTimersCallback (node_modules/@testing-library/dom/dist/wait-for.js:118:16)
      at Timeout.task [as _onTimeout] (node_modules/jsdom/lib/jsdom/browser/Window.js:520:19)

  ● useNotifications › should handle pagination

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: undefined

    [0m [90m 219 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useNotifications())
     [90m 220 |[39m
    [31m[1m>[22m[39m[90m 221 |[39m     expect(result[33m.[39mcurrent[33m.[39mhasMore)[33m.[39mtoBe([36mtrue[39m)
     [90m     |[39m                                    [31m[1m^[22m[39m
     [90m 222 |[39m     expect(result[33m.[39mcurrent[33m.[39mpagination)[33m.[39mtoEqual({
     [90m 223 |[39m       page[33m:[39m [35m1[39m[33m,[39m
     [90m 224 |[39m       limit[33m:[39m [35m10[39m[33m,[39m[0m

      at Object.toBe (src/__tests__/hooks/use-notifications.test.ts:221:36)

  ● useNotifications › should load more notifications

    TypeError: result.current.loadMore is not a function

    Ignored nodes: comments, script, style
    [36m<html>[39m
      [36m<head />[39m
      [36m<body>[39m
        [36m<div />[39m
      [36m</body>[39m
    [36m</html>[39m

    [0m [90m 251 |[39m
     [90m 252 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
    [31m[1m>[22m[39m[90m 253 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mloadMore()
     [90m     |[39m                            [31m[1m^[22m[39m
     [90m 254 |[39m     })
     [90m 255 |[39m
     [90m 256 |[39m     expect(global[33m.[39mfetch)[33m.[39mtoHaveBeenCalledWith([32m'/api/notifications?page=2&limit=10'[39m)[0m

      at loadMore (src/__tests__/hooks/use-notifications.test.ts:253:28)
      at runWithExpensiveErrorDiagnosticsDisabled (node_modules/@testing-library/dom/dist/config.js:47:12)
      at checkCallback (node_modules/@testing-library/dom/dist/wait-for.js:124:77)
      at checkRealTimersCallback (node_modules/@testing-library/dom/dist/wait-for.js:118:16)
      at Timeout.task [as _onTimeout] (node_modules/jsdom/lib/jsdom/browser/Window.js:520:19)

  ● useNotifications › should refresh notifications

    TypeError: result.current.refresh is not a function

    [0m [90m 269 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useNotifications())
     [90m 270 |[39m
    [31m[1m>[22m[39m[90m 271 |[39m     [36mawait[39m result[33m.[39mcurrent[33m.[39mrefresh()
     [90m     |[39m                          [31m[1m^[22m[39m
     [90m 272 |[39m
     [90m 273 |[39m     expect(mockMutate)[33m.[39mtoHaveBeenCalled()
     [90m 274 |[39m   })[0m

      at Object.refresh (src/__tests__/hooks/use-notifications.test.ts:271:26)

  ● useNotifications › should get unread notifications only

    TypeError: result.current.getUnreadNotifications is not a function

    [0m [90m 284 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useNotifications())
     [90m 285 |[39m
    [31m[1m>[22m[39m[90m 286 |[39m     [36mconst[39m unreadNotifications [33m=[39m result[33m.[39mcurrent[33m.[39mgetUnreadNotifications()
     [90m     |[39m                                                [31m[1m^[22m[39m
     [90m 287 |[39m     expect(unreadNotifications)[33m.[39mtoHaveLength([35m1[39m)
     [90m 288 |[39m     expect(unreadNotifications[[35m0[39m][33m.[39mid)[33m.[39mtoBe([32m'notification-1'[39m)
     [90m 289 |[39m   })[0m

      at Object.getUnreadNotifications (src/__tests__/hooks/use-notifications.test.ts:286:48)

Failed to collect coverage from C:\Users\Sai\Desktop\Code_\kiro_test_2\src\lib\bundle-optimization.ts
ERROR: 
  [31mx[0m Expected '>', got 'fallback'
    ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\lib\bundle-optimization.ts[0m:21:1]
 [2m21[0m |   if (suspense) {
 [2m22[0m |     const LazyComponent = lazy(importFn)
 [2m23[0m |     return (props: T) => (
 [2m24[0m |       <Suspense fallback={loading ? <loading /> : <div>Loading...</div>}>
    : [31;1m                ^^^^^^^^[0m
 [2m25[0m |         <LazyComponent {...props} />
 [2m26[0m |       </Suspense>
 [2m26[0m |     )
    `----


Caused by:
    Syntax Error
STACK: Error: 
  [31mx[0m Expected '>', got 'fallback'
    ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\lib\bundle-optimization.ts[0m:21:1]
 [2m21[0m |   if (suspense) {
 [2m22[0m |     const LazyComponent = lazy(importFn)
 [2m23[0m |     return (props: T) => (
 [2m24[0m |       <Suspense fallback={loading ? <loading /> : <div>Loading...</div>}>
    : [31;1m                ^^^^^^^^[0m
 [2m25[0m |         <LazyComponent {...props} />
 [2m26[0m |       </Suspense>
 [2m26[0m |     )
    `----


Caused by:
    Syntax Error
    at Object.transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:821:33)
    at transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:897:21)
    at process (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\jest-transformer.js:64:45)
    at ScriptTransformer.transformSourceAsync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\transform\build\ScriptTransformer.js:599:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async generateEmptyCoverage (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\reporters\build\generateEmptyCoverage.js:127:20)
Failed to collect coverage from C:\Users\Sai\Desktop\Code_\kiro_test_2\src\app\notifications\page.tsx
ERROR: 
  [31mx[0m Unexpected token `div`. Expected jsx identifier
    ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\app\notifications\page.tsx[0m:16:1]
 [2m16[0m |   }
 [2m17[0m | 
 [2m18[0m |   return (
 [2m19[0m |     <div className=\"container max-w-4xl mx-auto py-8\">
    : [31;1m     ^^^[0m
 [2m20[0m |       <NotificationsList />
 [2m21[0m |     </div>
 [2m21[0m |   )
    `----


Caused by:
    Syntax Error
STACK: Error: 
  [31mx[0m Unexpected token `div`. Expected jsx identifier
    ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\app\notifications\page.tsx[0m:16:1]
 [2m16[0m |   }
 [2m17[0m | 
 [2m18[0m |   return (
 [2m19[0m |     <div className=\"container max-w-4xl mx-auto py-8\">
    : [31;1m     ^^^[0m
 [2m20[0m |       <NotificationsList />
 [2m21[0m |     </div>
 [2m21[0m |   )
    `----


Caused by:
    Syntax Error
    at Object.transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:821:33)
    at transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:897:21)
    at process (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\jest-transformer.js:64:45)
    at ScriptTransformer.transformSourceAsync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\transform\build\ScriptTransformer.js:599:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async generateEmptyCoverage (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\reporters\build\generateEmptyCoverage.js:127:20)
Failed to collect coverage from C:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\admin\user-management.tsx
ERROR: 
  [31mx[0m Unexpected token `EmptyState`. Expected jsx identifier
     ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\admin\user-management.tsx[0m:204:1]
 [2m204[0m | 
 [2m205[0m |   if (error) {
 [2m206[0m |     return (
 [2m207[0m |       <EmptyState
     : [31;1m       ^^^^^^^^^^[0m
 [2m208[0m |         icon={Users}
 [2m209[0m |         title=\"Error Loading Users\"
 [2m209[0m |         description={error.message || 'Failed to load users'}
     `----


Caused by:
    Syntax Error
STACK: Error: 
  [31mx[0m Unexpected token `EmptyState`. Expected jsx identifier
     ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\admin\user-management.tsx[0m:204:1]
 [2m204[0m | 
 [2m205[0m |   if (error) {
 [2m206[0m |     return (
 [2m207[0m |       <EmptyState
     : [31;1m       ^^^^^^^^^^[0m
 [2m208[0m |         icon={Users}
 [2m209[0m |         title=\"Error Loading Users\"
 [2m209[0m |         description={error.message || 'Failed to load users'}
     `----


Caused by:
    Syntax Error
    at Object.transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:821:33)
    at transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:897:21)
    at process (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\jest-transformer.js:64:45)
    at ScriptTransformer.transformSourceAsync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\transform\build\ScriptTransformer.js:599:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async generateEmptyCoverage (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\reporters\build\generateEmptyCoverage.js:127:20)
Failed to collect coverage from C:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\feed\enhanced-interactive-feed.tsx
ERROR: 
  [31mx[0m Expected ',', got 'const'
    ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\feed\enhanced-interactive-feed.tsx[0m:58:1]
 [2m58[0m |   }
 [2m59[0m |   
 [2m60[0m |   // Handle sort changes
 [2m61[0m |   const handleSortChange = (sort: 'recent' | 'popular') => {
    : [31;1m  ^^^^^[0m
 [2m62[0m |     setSortBy(sort)
 [2m63[0m |   }
 [2m63[0m |   
    `----


Caused by:
    Syntax Error
STACK: Error: 
  [31mx[0m Expected ',', got 'const'
    ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\feed\enhanced-interactive-feed.tsx[0m:58:1]
 [2m58[0m |   }
 [2m59[0m |   
 [2m60[0m |   // Handle sort changes
 [2m61[0m |   const handleSortChange = (sort: 'recent' | 'popular') => {
    : [31;1m  ^^^^^[0m
 [2m62[0m |     setSortBy(sort)
 [2m63[0m |   }
 [2m63[0m |   
    `----


Caused by:
    Syntax Error
    at Object.transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:821:33)
    at transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:897:21)
    at process (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\jest-transformer.js:64:45)
    at ScriptTransformer.transformSourceAsync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\transform\build\ScriptTransformer.js:599:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async generateEmptyCoverage (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\reporters\build\generateEmptyCoverage.js:127:20)
Failed to collect coverage from C:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\layout\navbar.tsx
ERROR: 
  [31mx[0m Expression expected
    ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\layout\navbar.tsx[0m:53:1]
 [2m53[0m |   ]
 [2m54[0m | 
 [2m55[0m |   return (
 [2m56[0m |     <>
    : [31;1m     ^[0m
 [2m57[0m |       {/* Skip to main content link for accessibility */}
 [2m58[0m |       <a
 [2m58[0m |         href="#main-content"
    `----

  [31mx[0m Expected ',', got '< (jsx tag start)'
    ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\layout\navbar.tsx[0m:55:1]
 [2m55[0m |   return (
 [2m56[0m |     <>
 [2m57[0m |       {/* Skip to main content link for accessibility */}
 [2m58[0m |       <a
    : [31;1m      ^[0m
 [2m59[0m |         href="#main-content"
 [2m60[0m |         className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
 [2m60[0m |       >
    `----


Caused by:
    Syntax Error
STACK: Error: 
  [31mx[0m Expression expected
    ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\layout\navbar.tsx[0m:53:1]
 [2m53[0m |   ]
 [2m54[0m | 
 [2m55[0m |   return (
 [2m56[0m |     <>
    : [31;1m     ^[0m
 [2m57[0m |       {/* Skip to main content link for accessibility */}
 [2m58[0m |       <a
 [2m58[0m |         href="#main-content"
    `----

  [31mx[0m Expected ',', got '< (jsx tag start)'
    ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\layout\navbar.tsx[0m:55:1]
 [2m55[0m |   return (
 [2m56[0m |     <>
 [2m57[0m |       {/* Skip to main content link for accessibility */}
 [2m58[0m |       <a
    : [31;1m      ^[0m
 [2m59[0m |         href="#main-content"
 [2m60[0m |         className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
 [2m60[0m |       >
    `----


Caused by:
    Syntax Error
    at Object.transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:821:33)
    at transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:897:21)
    at process (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\jest-transformer.js:64:45)
    at ScriptTransformer.transformSourceAsync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\transform\build\ScriptTransformer.js:599:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async generateEmptyCoverage (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\reporters\build\generateEmptyCoverage.js:127:20)
Failed to collect coverage from C:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\notifications\notifications-list.tsx
ERROR: 
  [31mx[0m Unexpected token `EmptyState`. Expected jsx identifier
     ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\notifications\notifications-list.tsx[0m:226:1]
 [2m226[0m | 
 [2m227[0m |   if (!session) {
 [2m228[0m |     return (
 [2m229[0m |       <EmptyState
     : [31;1m       ^^^^^^^^^^[0m
 [2m230[0m |         icon={Bell}
 [2m231[0m |         title=\"Authentication Required\"
 [2m231[0m |         description=\"Please sign in to view your notifications\"
     `----


Caused by:
    Syntax Error
STACK: Error: 
  [31mx[0m Unexpected token `EmptyState`. Expected jsx identifier
     ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\notifications\notifications-list.tsx[0m:226:1]
 [2m226[0m | 
 [2m227[0m |   if (!session) {
 [2m228[0m |     return (
 [2m229[0m |       <EmptyState
     : [31;1m       ^^^^^^^^^^[0m
 [2m230[0m |         icon={Bell}
 [2m231[0m |         title=\"Authentication Required\"
 [2m231[0m |         description=\"Please sign in to view your notifications\"
     `----


Caused by:
    Syntax Error
    at Object.transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:821:33)
    at transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:897:21)
    at process (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\jest-transformer.js:64:45)
    at ScriptTransformer.transformSourceAsync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\transform\build\ScriptTransformer.js:599:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async generateEmptyCoverage (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\reporters\build\generateEmptyCoverage.js:127:20)
Failed to collect coverage from C:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\profile\following-list.tsx
ERROR: 
  [31mx[0m Unexpected token `EmptyState`. Expected jsx identifier
     ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\profile\following-list.tsx[0m:151:1]
 [2m151[0m | 
 [2m152[0m |   if (!session) {
 [2m153[0m |     return (
 [2m154[0m |       <EmptyState
     : [31;1m       ^^^^^^^^^^[0m
 [2m155[0m |         icon={UserCheck}
 [2m156[0m |         title=\"Authentication Required\"
 [2m156[0m |         description=\"Please sign in to view following\"
     `----


Caused by:
    Syntax Error
STACK: Error: 
  [31mx[0m Unexpected token `EmptyState`. Expected jsx identifier
     ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\profile\following-list.tsx[0m:151:1]
 [2m151[0m | 
 [2m152[0m |   if (!session) {
 [2m153[0m |     return (
 [2m154[0m |       <EmptyState
     : [31;1m       ^^^^^^^^^^[0m
 [2m155[0m |         icon={UserCheck}
 [2m156[0m |         title=\"Authentication Required\"
 [2m156[0m |         description=\"Please sign in to view following\"
     `----


Caused by:
    Syntax Error
    at Object.transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:821:33)
    at transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:897:21)
    at process (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\jest-transformer.js:64:45)
    at ScriptTransformer.transformSourceAsync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\transform\build\ScriptTransformer.js:599:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async generateEmptyCoverage (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\reporters\build\generateEmptyCoverage.js:127:20)
Failed to collect coverage from C:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\profile\followers-list.tsx
ERROR: 
  [31mx[0m Unexpected token `EmptyState`. Expected jsx identifier
     ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\profile\followers-list.tsx[0m:151:1]
 [2m151[0m | 
 [2m152[0m |   if (!session) {
 [2m153[0m |     return (
 [2m154[0m |       <EmptyState
     : [31;1m       ^^^^^^^^^^[0m
 [2m155[0m |         icon={Users}
 [2m156[0m |         title=\"Authentication Required\"
 [2m156[0m |         description=\"Please sign in to view followers\"
     `----


Caused by:
    Syntax Error
STACK: Error: 
  [31mx[0m Unexpected token `EmptyState`. Expected jsx identifier
     ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\profile\followers-list.tsx[0m:151:1]
 [2m151[0m | 
 [2m152[0m |   if (!session) {
 [2m153[0m |     return (
 [2m154[0m |       <EmptyState
     : [31;1m       ^^^^^^^^^^[0m
 [2m155[0m |         icon={Users}
 [2m156[0m |         title=\"Authentication Required\"
 [2m156[0m |         description=\"Please sign in to view followers\"
     `----


Caused by:
    Syntax Error
    at Object.transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:821:33)
    at transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:897:21)
    at process (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\jest-transformer.js:64:45)
    at ScriptTransformer.transformSourceAsync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\transform\build\ScriptTransformer.js:599:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async generateEmptyCoverage (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\reporters\build\generateEmptyCoverage.js:127:20)
Failed to collect coverage from C:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\ui\follow-button.tsx
ERROR: 
  [31mx[0m Unexpected token `Button`. Expected jsx identifier
     ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\ui\follow-button.tsx[0m:99:1]
 [2m 99[0m | 
 [2m100[0m |   if (error) {
 [2m101[0m |     return (
 [2m102[0m |       <Button
     : [31;1m       ^^^^^^[0m
 [2m103[0m |         variant=\"outline\"
 [2m104[0m |         size={size}
 [2m104[0m |         disabled
     `----


Caused by:
    Syntax Error
STACK: Error: 
  [31mx[0m Unexpected token `Button`. Expected jsx identifier
     ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\ui\follow-button.tsx[0m:99:1]
 [2m 99[0m | 
 [2m100[0m |   if (error) {
 [2m101[0m |     return (
 [2m102[0m |       <Button
     : [31;1m       ^^^^^^[0m
 [2m103[0m |         variant=\"outline\"
 [2m104[0m |         size={size}
 [2m104[0m |         disabled
     `----


Caused by:
    Syntax Error
    at Object.transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:821:33)
    at transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:897:21)
    at process (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\jest-transformer.js:64:45)
    at ScriptTransformer.transformSourceAsync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\transform\build\ScriptTransformer.js:599:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async generateEmptyCoverage (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\reporters\build\generateEmptyCoverage.js:127:20)
Failed to collect coverage from C:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\rankings\ranking-board.tsx
ERROR: 
  [31mx[0m the name `getRankingInfo` is defined multiple times
     ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\rankings\ranking-board.tsx[0m:2:1]
 [2m  2[0m | 
 [2m  3[0m | import { useState } from 'react'
 [2m  4[0m | import { Ranking, RankingType } from '@/types'
 [2m  5[0m | import { getRankingInfo, getRankingColorClass, getRankBadgeColor, getRankEmoji } from '@/lib/ranking'
     : [31;1m         ^^^^^^^|^^^^^^[0m
     :                 [31;1m`-- [31;1mprevious definition of `getRankingInfo` here[0m[0m
 [2m  6[0m | import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
 [2m  7[0m | import { Badge } from '@/components/ui/badge'
 [2m  8[0m | import { Button } from '@/components/ui/button'
 [2m  9[0m | import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
 [2m 10[0m | import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
 [2m 11[0m | import { UserBadge } from '@/components/ui/user-badge'
 [2m 12[0m | import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
 [2m 13[0m | import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
 [2m 14[0m | import { cn } from '@/lib/utils'
 [2m 15[0m | 
 [2m 16[0m | interface RankingBoardProps {
 [2m 17[0m |   rankings: Record<string, Record<string, Ranking[]>>
 [2m 18[0m |   isLoading?: boolean
 [2m 19[0m | }
 [2m 20[0m | 
 [2m 21[0m | export function RankingBoard({ rankings, isLoading }: RankingBoardProps) {
 [2m 22[0m |   const [selectedType, setSelectedType] = useState<RankingType>('ENGAGEMENT')
 [2m 23[0m |   const [selectedPeriod, setSelectedPeriod] = useState<string>('all-time')
 [2m 24[0m | 
 [2m 25[0m |   if (isLoading) {
 [2m 26[0m |     return (
 [2m 27[0m |       <div className="space-y-4">
 [2m 28[0m |         {Array.from({ length: 5 }).map((_, i) => (
 [2m 29[0m |           <div key={i} className="h-16 bg-muted rounded animate-pulse" />
 [2m 30[0m |         ))}
 [2m 31[0m |       </div>
 [2m 32[0m |     )
 [2m 33[0m |   }
 [2m 34[0m | 
 [2m 35[0m |   const currentRankings = rankings[selectedType]?.[selectedPeriod] || []
 [2m 36[0m |   const availablePeriods = rankings[selectedType] ? Object.keys(rankings[selectedType]) : ['all-time']
 [2m 37[0m | 
 [2m 38[0m |   return (
 [2m 39[0m |     <div className="space-y-6">
 [2m 40[0m |       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
 [2m 41[0m |         <div>
 [2m 42[0m |           <h2 className="text-2xl font-bold">Community Rankings</h2>
 [2m 43[0m |           <p className="text-muted-foreground">
 [2m 44[0m |             See who's leading the community in various categories
 [2m 45[0m |           </p>
 [2m 46[0m |         </div>
 [2m 47[0m |         
 [2m 48[0m |         <div className="flex gap-2">
 [2m 49[0m |           <Select value={selectedType} onValueChange={(value) => setSelectedType(value as RankingType)}>
 [2m 50[0m |             <SelectTrigger className="w-48">
 [2m 51[0m |               <SelectValue />
 [2m 52[0m |             </SelectTrigger>
 [2m 53[0m |             <SelectContent>
 [2m 54[0m |               {Object.entries(getRankingInfo).map(([type, info]) => (
 [2m 55[0m |                 <SelectItem key={type} value={type}>
 [2m 56[0m |                   <div className="flex items-center gap-2">
 [2m 57[0m |                     <span>{info.icon}</span>
 [2m 58[0m |                     <span>{info.name}</span>
 [2m 59[0m |                   </div>
 [2m 60[0m |                 </SelectItem>
 [2m 61[0m |               ))}
 [2m 62[0m |             </SelectContent>
 [2m 63[0m |           </Select>
 [2m 64[0m |           
 [2m 65[0m |           <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
 [2m 66[0m |             <SelectTrigger className="w-32">
 [2m 67[0m |               <SelectValue />
 [2m 68[0m |             </SelectTrigger>
 [2m 69[0m |             <SelectContent>
 [2m 70[0m |               {availablePeriods.map((period) => (
 [2m 71[0m |                 <SelectItem key={period} value={period}>
 [2m 72[0m |                   {formatPeriod(period)}
 [2m 73[0m |                 </SelectItem>
 [2m 74[0m |               ))}
 [2m 75[0m |             </SelectContent>
 [2m 76[0m |           </Select>
 [2m 77[0m |         </div>
 [2m 78[0m |       </div>
 [2m 79[0m | 
 [2m 80[0m |       <Card>
 [2m 81[0m |         <CardHeader>
 [2m 82[0m |           <div className="flex items-center gap-3">
 [2m 83[0m |             <span className="text-2xl">{getRankingInfo(selectedType).icon}</span>
 [2m 84[0m |             <div>
 [2m 85[0m |               <CardTitle className="flex items-center gap-2">
 [2m 86[0m |                 {getRankingInfo(selectedType).name}
 [2m 87[0m |                 <Badge className={getRankingColorClass(selectedType)}>
 [2m 88[0m |                   {formatPeriod(selectedPeriod)}
 [2m 89[0m |                 </Badge>
 [2m 90[0m |               </CardTitle>
 [2m 91[0m |               <CardDescription>
 [2m 92[0m |                 {getRankingInfo(selectedType).description}
 [2m 93[0m |               </CardDescription>
 [2m 94[0m |             </div>
 [2m 95[0m |           </div>
 [2m 96[0m |         </CardHeader>
 [2m 97[0m |         <CardContent>
 [2m 98[0m |           {currentRankings.length === 0 ? (
 [2m 99[0m |             <div className="text-center py-8">
 [2m100[0m |               <div className="text-4xl mb-2">📊</div>
 [2m101[0m |               <h3 className="font-semibold mb-1">No Rankings Yet</h3>
 [2m102[0m |               <p className="text-sm text-muted-foreground">
 [2m103[0m |                 Rankings will appear here once users start engaging with the community
 [2m104[0m |               </p>
 [2m105[0m |             </div>
 [2m106[0m |           ) : (
 [2m107[0m |             <div className="space-y-3">
 [2m108[0m |               {currentRankings.slice(0, 3).map((ranking) => (
 [2m109[0m |                 <TopRankingCard key={ranking.id} ranking={ranking} />
 [2m110[0m |               ))}
 [2m111[0m |               
 [2m112[0m |               {currentRankings.length > 3 && (
 [2m113[0m |                 <div className="space-y-2 pt-4 border-t">
 [2m114[0m |                   {currentRankings.slice(3, 10).map((ranking) => (
 [2m115[0m |                     <RankingRow key={ranking.id} ranking={ranking} />
 [2m116[0m |                   ))}
 [2m117[0m |                 </div>
 [2m118[0m |               )}
 [2m119[0m |               
 [2m120[0m |               {currentRankings.length > 10 && (
 [2m121[0m |                 <div className="text-center pt-4">
 [2m122[0m |                   <Button variant="outline" size="sm">
 [2m123[0m |                     View All Rankings
 [2m124[0m |                   </Button>
 [2m125[0m |                 </div>
 [2m126[0m |               )}
 [2m127[0m |             </div>
 [2m128[0m |           )}
 [2m129[0m |         </CardContent>
 [2m130[0m |       </Card>
 [2m131[0m |     </div>
 [2m132[0m |   )
 [2m133[0m | }
 [2m134[0m | 
 [2m135[0m | function TopRankingCard({ ranking }: { ranking: Ranking }) {
 [2m136[0m |   const rankColor = getRankBadgeColor(ranking.rank || 0)
 [2m137[0m |   const emoji = getRankEmoji(ranking.rank || 0)
 [2m138[0m | 
 [2m139[0m |   return (
 [2m140[0m |     <Card className={cn(
 [2m141[0m |       'relative overflow-hidden',
 [2m142[0m |       ranking.rank === 1 && 'ring-2 ring-yellow-200 bg-yellow-50/50',
 [2m143[0m |       ranking.rank === 2 && 'ring-2 ring-gray-200 bg-gray-50/50',
 [2m144[0m |       ranking.rank === 3 && 'ring-2 ring-orange-200 bg-orange-50/50'
 [2m145[0m |     )}>
 [2m146[0m |       <CardContent className="p-4">
 [2m147[0m |         <div className="flex items-center justify-between">
 [2m148[0m |           <div className="flex items-center gap-4">
 [2m149[0m |             <div className="relative">
 [2m150[0m |               <Avatar className="h-12 w-12">
 [2m151[0m |                 <AvatarImage src={ranking.user?.image || undefined} />
 [2m152[0m |                 <AvatarFallback>
 [2m153[0m |                   {ranking.user?.name?.[0] || ranking.user?.username?.[0] || '?'}
 [2m154[0m |                 </AvatarFallback>
 [2m155[0m |               </Avatar>
 [2m156[0m |               <div className="absolute -top-1 -right-1">
 [2m157[0m |                 <Badge className={cn('text-xs px-1.5 py-0.5', rankColor)}>
 [2m158[0m |                   {emoji}
 [2m159[0m |                 </Badge>
 [2m160[0m |               </div>
 [2m161[0m |             </div>
 [2m162[0m |             
 [2m163[0m |             <div className="flex-1 min-w-0">
 [2m164[0m |               <div className="flex items-center gap-2 mb-1">
 [2m165[0m |                 <h3 className="font-semibold truncate">
 [2m166[0m |                   {ranking.user?.name || ranking.user?.username}
 [2m167[0m |                 </h3>
 [2m168[0m |                 {ranking.user?.mbti && (
 [2m169[0m |                   <Badge variant="secondary" className="text-xs">
 [2m170[0m |                     {ranking.user.mbti.type}
 [2m171[0m |                   </Badge>
 [2m172[0m |                 )}
 [2m173[0m |               </div>
 [2m174[0m |               <p className="text-sm text-muted-foreground">
 [2m175[0m |                 @{ranking.user?.username}
 [2m176[0m |               </p>
 [2m177[0m |             </div>
 [2m178[0m |           </div>
 [2m179[0m |           
 [2m180[0m |           <div className="text-right">
 [2m181[0m |             <div className="text-2xl font-bold">
 [2m182[0m |               {ranking.score.toLocaleString()}
 [2m183[0m |             </div>
 [2m184[0m |             <div className="text-xs text-muted-foreground">
 [2m185[0m |               points
 [2m186[0m |             </div>
 [2m187[0m |           </div>
 [2m188[0m |         </div>
 [2m189[0m |       </CardContent>
 [2m190[0m |     </Card>
 [2m191[0m |   )
 [2m192[0m | }
 [2m193[0m | 
 [2m194[0m | function RankingRow({ ranking }: { ranking: Ranking }) {
 [2m195[0m |   const rankColor = getRankBadgeColor(ranking.rank || 0)
 [2m196[0m |   const emoji = getRankEmoji(ranking.rank || 0)
 [2m197[0m | 
 [2m198[0m |   return (
 [2m199[0m |     <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
 [2m200[0m |       <div className="flex items-center gap-3">
 [2m201[0m |         <Badge className={cn('text-xs px-2 py-1', rankColor)}>
 [2m202[0m |           {emoji} #{ranking.rank}
 [2m203[0m |         </Badge>
 [2m204[0m |         
 [2m205[0m |         <Avatar className="h-8 w-8">
 [2m206[0m |           <AvatarImage src={ranking.user?.image || undefined} />
 [2m207[0m |           <AvatarFallback className="text-xs">
 [2m208[0m |             {ranking.user?.name?.[0] || ranking.user?.username?.[0] || '?'}
 [2m209[0m |           </AvatarFallback>
 [2m210[0m |         </Avatar>
 [2m211[0m |         
 [2m212[0m |         <div className="flex-1 min-w-0">
 [2m213[0m |           <div className="flex items-center gap-2">
 [2m214[0m |             <span className="font-medium truncate">
 [2m215[0m |               {ranking.user?.name || ranking.user?.username}
 [2m216[0m |             </span>
 [2m217[0m |             {ranking.user?.mbti && (
 [2m218[0m |               <Badge variant="secondary" className="text-xs">
 [2m219[0m |                 {ranking.user.mbti.type}
 [2m220[0m |               </Badge>
 [2m221[0m |             )}
 [2m222[0m |           </div>
 [2m223[0m |           <span className="text-xs text-muted-foreground">
 [2m224[0m |             @{ranking.user?.username}
 [2m225[0m |           </span>
 [2m226[0m |         </div>
 [2m227[0m |       </div>
 [2m228[0m |       
 [2m229[0m |       <div className="text-right">
 [2m230[0m |         <div className="font-semibold">
 [2m231[0m |           {ranking.score.toLocaleString()}
 [2m232[0m |         </div>
 [2m233[0m |         <div className="text-xs text-muted-foreground">
 [2m234[0m |           pts
 [2m235[0m |         </div>
 [2m236[0m |       </div>
 [2m237[0m |     </div>
 [2m238[0m |   )
 [2m239[0m | }
 [2m240[0m | 
 [2m241[0m | function formatPeriod(period: string): string {
 [2m242[0m |   if (period === 'all-time') return 'All Time'
 [2m243[0m |   if (period.includes('-W')) {
 [2m244[0m |     const [year, week] = period.split('-W')
 [2m245[0m |     return `Week ${week}, ${year}`
 [2m246[0m |   }
 [2m247[0m |   if (period.includes('-')) {
 [2m248[0m |     const [year, month] = period.split('-')
 [2m249[0m |     const monthNames = [
 [2m250[0m |       'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
 [2m251[0m |       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
 [2m252[0m |     ]
 [2m253[0m |     return `${monthNames[parseInt(month) - 1]} ${year}`
 [2m254[0m |   }
 [2m255[0m |   return period
 [2m256[0m | }
 [2m257[0m | 
 [2m258[0m | const getRankingInfo = (type: RankingType) => {
     : [33;1m      ^^^^^^^|^^^^^^[0m
     :              [33;1m`-- [33;1m`getRankingInfo` redefined here[0m[0m
 [2m259[0m |   const info = {
 [2m260[0m |     POSTS_LIKES: { name: 'Most Liked', description: 'Users with the most likes', icon: '❤️' },
 [2m260[0m |     POSTS_COUNT: { name: 'Most Active', description: 'Users with the most posts', icon: '📝' },
     `----

STACK: Error: 
  [31mx[0m the name `getRankingInfo` is defined multiple times
     ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\rankings\ranking-board.tsx[0m:2:1]
 [2m  2[0m | 
 [2m  3[0m | import { useState } from 'react'
 [2m  4[0m | import { Ranking, RankingType } from '@/types'
 [2m  5[0m | import { getRankingInfo, getRankingColorClass, getRankBadgeColor, getRankEmoji } from '@/lib/ranking'
     : [31;1m         ^^^^^^^|^^^^^^[0m
     :                 [31;1m`-- [31;1mprevious definition of `getRankingInfo` here[0m[0m
 [2m  6[0m | import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
 [2m  7[0m | import { Badge } from '@/components/ui/badge'
 [2m  8[0m | import { Button } from '@/components/ui/button'
 [2m  9[0m | import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
 [2m 10[0m | import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
 [2m 11[0m | import { UserBadge } from '@/components/ui/user-badge'
 [2m 12[0m | import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
 [2m 13[0m | import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
 [2m 14[0m | import { cn } from '@/lib/utils'
 [2m 15[0m | 
 [2m 16[0m | interface RankingBoardProps {
 [2m 17[0m |   rankings: Record<string, Record<string, Ranking[]>>
 [2m 18[0m |   isLoading?: boolean
 [2m 19[0m | }
 [2m 20[0m | 
 [2m 21[0m | export function RankingBoard({ rankings, isLoading }: RankingBoardProps) {
 [2m 22[0m |   const [selectedType, setSelectedType] = useState<RankingType>('ENGAGEMENT')
 [2m 23[0m |   const [selectedPeriod, setSelectedPeriod] = useState<string>('all-time')
 [2m 24[0m | 
 [2m 25[0m |   if (isLoading) {
 [2m 26[0m |     return (
 [2m 27[0m |       <div className="space-y-4">
 [2m 28[0m |         {Array.from({ length: 5 }).map((_, i) => (
 [2m 29[0m |           <div key={i} className="h-16 bg-muted rounded animate-pulse" />
 [2m 30[0m |         ))}
 [2m 31[0m |       </div>
 [2m 32[0m |     )
 [2m 33[0m |   }
 [2m 34[0m | 
 [2m 35[0m |   const currentRankings = rankings[selectedType]?.[selectedPeriod] || []
 [2m 36[0m |   const availablePeriods = rankings[selectedType] ? Object.keys(rankings[selectedType]) : ['all-time']
 [2m 37[0m | 
 [2m 38[0m |   return (
 [2m 39[0m |     <div className="space-y-6">
 [2m 40[0m |       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
 [2m 41[0m |         <div>
 [2m 42[0m |           <h2 className="text-2xl font-bold">Community Rankings</h2>
 [2m 43[0m |           <p className="text-muted-foreground">
 [2m 44[0m |             See who's leading the community in various categories
 [2m 45[0m |           </p>
 [2m 46[0m |         </div>
 [2m 47[0m |         
 [2m 48[0m |         <div className="flex gap-2">
 [2m 49[0m |           <Select value={selectedType} onValueChange={(value) => setSelectedType(value as RankingType)}>
 [2m 50[0m |             <SelectTrigger className="w-48">
 [2m 51[0m |               <SelectValue />
 [2m 52[0m |             </SelectTrigger>
 [2m 53[0m |             <SelectContent>
 [2m 54[0m |               {Object.entries(getRankingInfo).map(([type, info]) => (
 [2m 55[0m |                 <SelectItem key={type} value={type}>
 [2m 56[0m |                   <div className="flex items-center gap-2">
 [2m 57[0m |                     <span>{info.icon}</span>
 [2m 58[0m |                     <span>{info.name}</span>
 [2m 59[0m |                   </div>
 [2m 60[0m |                 </SelectItem>
 [2m 61[0m |               ))}
 [2m 62[0m |             </SelectContent>
 [2m 63[0m |           </Select>
 [2m 64[0m |           
 [2m 65[0m |           <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
 [2m 66[0m |             <SelectTrigger className="w-32">
 [2m 67[0m |               <SelectValue />
 [2m 68[0m |             </SelectTrigger>
 [2m 69[0m |             <SelectContent>
 [2m 70[0m |               {availablePeriods.map((period) => (
 [2m 71[0m |                 <SelectItem key={period} value={period}>
 [2m 72[0m |                   {formatPeriod(period)}
 [2m 73[0m |                 </SelectItem>
 [2m 74[0m |               ))}
 [2m 75[0m |             </SelectContent>
 [2m 76[0m |           </Select>
 [2m 77[0m |         </div>
 [2m 78[0m |       </div>
 [2m 79[0m | 
 [2m 80[0m |       <Card>
 [2m 81[0m |         <CardHeader>
 [2m 82[0m |           <div className="flex items-center gap-3">
 [2m 83[0m |             <span className="text-2xl">{getRankingInfo(selectedType).icon}</span>
 [2m 84[0m |             <div>
 [2m 85[0m |               <CardTitle className="flex items-center gap-2">
 [2m 86[0m |                 {getRankingInfo(selectedType).name}
 [2m 87[0m |                 <Badge className={getRankingColorClass(selectedType)}>
 [2m 88[0m |                   {formatPeriod(selectedPeriod)}
 [2m 89[0m |                 </Badge>
 [2m 90[0m |               </CardTitle>
 [2m 91[0m |               <CardDescription>
 [2m 92[0m |                 {getRankingInfo(selectedType).description}
 [2m 93[0m |               </CardDescription>
 [2m 94[0m |             </div>
 [2m 95[0m |           </div>
 [2m 96[0m |         </CardHeader>
 [2m 97[0m |         <CardContent>
 [2m 98[0m |           {currentRankings.length === 0 ? (
 [2m 99[0m |             <div className="text-center py-8">
 [2m100[0m |               <div className="text-4xl mb-2">📊</div>
 [2m101[0m |               <h3 className="font-semibold mb-1">No Rankings Yet</h3>
 [2m102[0m |               <p className="text-sm text-muted-foreground">
 [2m103[0m |                 Rankings will appear here once users start engaging with the community
 [2m104[0m |               </p>
 [2m105[0m |             </div>
 [2m106[0m |           ) : (
 [2m107[0m |             <div className="space-y-3">
 [2m108[0m |               {currentRankings.slice(0, 3).map((ranking) => (
 [2m109[0m |                 <TopRankingCard key={ranking.id} ranking={ranking} />
 [2m110[0m |               ))}
 [2m111[0m |               
 [2m112[0m |               {currentRankings.length > 3 && (
 [2m113[0m |                 <div className="space-y-2 pt-4 border-t">
 [2m114[0m |                   {currentRankings.slice(3, 10).map((ranking) => (
 [2m115[0m |                     <RankingRow key={ranking.id} ranking={ranking} />
 [2m116[0m |                   ))}
 [2m117[0m |                 </div>
 [2m118[0m |               )}
 [2m119[0m |               
 [2m120[0m |               {currentRankings.length > 10 && (
 [2m121[0m |                 <div className="text-center pt-4">
 [2m122[0m |                   <Button variant="outline" size="sm">
 [2m123[0m |                     View All Rankings
 [2m124[0m |                   </Button>
 [2m125[0m |                 </div>
 [2m126[0m |               )}
 [2m127[0m |             </div>
 [2m128[0m |           )}
 [2m129[0m |         </CardContent>
 [2m130[0m |       </Card>
 [2m131[0m |     </div>
 [2m132[0m |   )
 [2m133[0m | }
 [2m134[0m | 
 [2m135[0m | function TopRankingCard({ ranking }: { ranking: Ranking }) {
 [2m136[0m |   const rankColor = getRankBadgeColor(ranking.rank || 0)
 [2m137[0m |   const emoji = getRankEmoji(ranking.rank || 0)
 [2m138[0m | 
 [2m139[0m |   return (
 [2m140[0m |     <Card className={cn(
 [2m141[0m |       'relative overflow-hidden',
 [2m142[0m |       ranking.rank === 1 && 'ring-2 ring-yellow-200 bg-yellow-50/50',
 [2m143[0m |       ranking.rank === 2 && 'ring-2 ring-gray-200 bg-gray-50/50',
 [2m144[0m |       ranking.rank === 3 && 'ring-2 ring-orange-200 bg-orange-50/50'
 [2m145[0m |     )}>
 [2m146[0m |       <CardContent className="p-4">
 [2m147[0m |         <div className="flex items-center justify-between">
 [2m148[0m |           <div className="flex items-center gap-4">
 [2m149[0m |             <div className="relative">
 [2m150[0m |               <Avatar className="h-12 w-12">
 [2m151[0m |                 <AvatarImage src={ranking.user?.image || undefined} />
 [2m152[0m |                 <AvatarFallback>
 [2m153[0m |                   {ranking.user?.name?.[0] || ranking.user?.username?.[0] || '?'}
 [2m154[0m |                 </AvatarFallback>
 [2m155[0m |               </Avatar>
 [2m156[0m |               <div className="absolute -top-1 -right-1">
 [2m157[0m |                 <Badge className={cn('text-xs px-1.5 py-0.5', rankColor)}>
 [2m158[0m |                   {emoji}
 [2m159[0m |                 </Badge>
 [2m160[0m |               </div>
 [2m161[0m |             </div>
 [2m162[0m |             
 [2m163[0m |             <div className="flex-1 min-w-0">
 [2m164[0m |               <div className="flex items-center gap-2 mb-1">
 [2m165[0m |                 <h3 className="font-semibold truncate">
 [2m166[0m |                   {ranking.user?.name || ranking.user?.username}
 [2m167[0m |                 </h3>
 [2m168[0m |                 {ranking.user?.mbti && (
 [2m169[0m |                   <Badge variant="secondary" className="text-xs">
 [2m170[0m |                     {ranking.user.mbti.type}
 [2m171[0m |                   </Badge>
 [2m172[0m |                 )}
 [2m173[0m |               </div>
 [2m174[0m |               <p className="text-sm text-muted-foreground">
 [2m175[0m |                 @{ranking.user?.username}
 [2m176[0m |               </p>
 [2m177[0m |             </div>
 [2m178[0m |           </div>
 [2m179[0m |           
 [2m180[0m |           <div className="text-right">
 [2m181[0m |             <div className="text-2xl font-bold">
 [2m182[0m |               {ranking.score.toLocaleString()}
 [2m183[0m |             </div>
 [2m184[0m |             <div className="text-xs text-muted-foreground">
 [2m185[0m |               points
 [2m186[0m |             </div>
 [2m187[0m |           </div>
 [2m188[0m |         </div>
 [2m189[0m |       </CardContent>
 [2m190[0m |     </Card>
 [2m191[0m |   )
 [2m192[0m | }
 [2m193[0m | 
 [2m194[0m | function RankingRow({ ranking }: { ranking: Ranking }) {
 [2m195[0m |   const rankColor = getRankBadgeColor(ranking.rank || 0)
 [2m196[0m |   const emoji = getRankEmoji(ranking.rank || 0)
 [2m197[0m | 
 [2m198[0m |   return (
 [2m199[0m |     <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
 [2m200[0m |       <div className="flex items-center gap-3">
 [2m201[0m |         <Badge className={cn('text-xs px-2 py-1', rankColor)}>
 [2m202[0m |           {emoji} #{ranking.rank}
 [2m203[0m |         </Badge>
 [2m204[0m |         
 [2m205[0m |         <Avatar className="h-8 w-8">
 [2m206[0m |           <AvatarImage src={ranking.user?.image || undefined} />
 [2m207[0m |           <AvatarFallback className="text-xs">
 [2m208[0m |             {ranking.user?.name?.[0] || ranking.user?.username?.[0] || '?'}
 [2m209[0m |           </AvatarFallback>
 [2m210[0m |         </Avatar>
 [2m211[0m |         
 [2m212[0m |         <div className="flex-1 min-w-0">
 [2m213[0m |           <div className="flex items-center gap-2">
 [2m214[0m |             <span className="font-medium truncate">
 [2m215[0m |               {ranking.user?.name || ranking.user?.username}
 [2m216[0m |             </span>
 [2m217[0m |             {ranking.user?.mbti && (
 [2m218[0m |               <Badge variant="secondary" className="text-xs">
 [2m219[0m |                 {ranking.user.mbti.type}
 [2m220[0m |               </Badge>
 [2m221[0m |             )}
 [2m222[0m |           </div>
 [2m223[0m |           <span className="text-xs text-muted-foreground">
 [2m224[0m |             @{ranking.user?.username}
 [2m225[0m |           </span>
 [2m226[0m |         </div>
 [2m227[0m |       </div>
 [2m228[0m |       
 [2m229[0m |       <div className="text-right">
 [2m230[0m |         <div className="font-semibold">
 [2m231[0m |           {ranking.score.toLocaleString()}
 [2m232[0m |         </div>
 [2m233[0m |         <div className="text-xs text-muted-foreground">
 [2m234[0m |           pts
 [2m235[0m |         </div>
 [2m236[0m |       </div>
 [2m237[0m |     </div>
 [2m238[0m |   )
 [2m239[0m | }
 [2m240[0m | 
 [2m241[0m | function formatPeriod(period: string): string {
 [2m242[0m |   if (period === 'all-time') return 'All Time'
 [2m243[0m |   if (period.includes('-W')) {
 [2m244[0m |     const [year, week] = period.split('-W')
 [2m245[0m |     return `Week ${week}, ${year}`
 [2m246[0m |   }
 [2m247[0m |   if (period.includes('-')) {
 [2m248[0m |     const [year, month] = period.split('-')
 [2m249[0m |     const monthNames = [
 [2m250[0m |       'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
 [2m251[0m |       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
 [2m252[0m |     ]
 [2m253[0m |     return `${monthNames[parseInt(month) - 1]} ${year}`
 [2m254[0m |   }
 [2m255[0m |   return period
 [2m256[0m | }
 [2m257[0m | 
 [2m258[0m | const getRankingInfo = (type: RankingType) => {
     : [33;1m      ^^^^^^^|^^^^^^[0m
     :              [33;1m`-- [33;1m`getRankingInfo` redefined here[0m[0m
 [2m259[0m |   const info = {
 [2m260[0m |     POSTS_LIKES: { name: 'Most Liked', description: 'Users with the most likes', icon: '❤️' },
 [2m260[0m |     POSTS_COUNT: { name: 'Most Active', description: 'Users with the most posts', icon: '📝' },
     `----

    at Object.transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:821:33)
    at transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:897:21)
    at process (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\jest-transformer.js:64:45)
    at ScriptTransformer.transformSourceAsync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\transform\build\ScriptTransformer.js:599:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async generateEmptyCoverage (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\reporters\build\generateEmptyCoverage.js:127:20)
Failed to collect coverage from C:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\ui\scroll-area.tsx
ERROR: 
  [31mx[0m Unexpected token `ScrollAreaPrimitive`. Expected jsx identifier
    ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\ui\scroll-area.tsx[0m:8:1]
 [2m 8[0m |   React.ElementRef<typeof ScrollAreaPrimitive.Root>,
 [2m 9[0m |   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
 [2m10[0m | >(({ className, children, ...props }, ref) => (
 [2m11[0m |   <ScrollAreaPrimitive.Root
    : [31;1m   ^^^^^^^^^^^^^^^^^^^[0m
 [2m12[0m |     ref={ref}
 [2m13[0m |     className={cn('relative overflow-hidden', className)}
 [2m13[0m |     {...props}
    `----


Caused by:
    Syntax Error
STACK: Error: 
  [31mx[0m Unexpected token `ScrollAreaPrimitive`. Expected jsx identifier
    ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\ui\scroll-area.tsx[0m:8:1]
 [2m 8[0m |   React.ElementRef<typeof ScrollAreaPrimitive.Root>,
 [2m 9[0m |   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
 [2m10[0m | >(({ className, children, ...props }, ref) => (
 [2m11[0m |   <ScrollAreaPrimitive.Root
    : [31;1m   ^^^^^^^^^^^^^^^^^^^[0m
 [2m12[0m |     ref={ref}
 [2m13[0m |     className={cn('relative overflow-hidden', className)}
 [2m13[0m |     {...props}
    `----


Caused by:
    Syntax Error
    at Object.transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:821:33)
    at transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:897:21)
    at process (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\jest-transformer.js:64:45)
    at ScriptTransformer.transformSourceAsync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\transform\build\ScriptTransformer.js:599:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async generateEmptyCoverage (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\reporters\build\generateEmptyCoverage.js:127:20)
Failed to collect coverage from C:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\ui\notification-item.tsx
ERROR: 
  [31mx[0m Expected unicode escape
    ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\ui\notification-item.tsx[0m:46:1]
 [2m46[0m |   onMarkAsUnread?: (notificationId: string) => void
 [2m47[0m |   onDelete?: (notificationId: string) => void
 [2m48[0m |   className?: string
 [2m49[0m | }\n\nconst getNotificationIcon = (type: string) => {\n  switch (type) {\n    case 'LIKE':\n      return <Heart className=\"h-4 w-4 text-red-500\" />\n    case 'COMMENT':\n      return <MessageCircle className=\"h-4 w-4 text-blue-500\" />\n    case 'FOLLOW':\n      return <UserPlus className=\"h-4 w-4 text-green-500\" />\n    default:\n      return null\n  }\n}\n\nconst getNotificationLink = (notification: NotificationItemProps['notification']) => {\n  switch (notification.type) {\n    case 'LIKE':\n    case 'COMMENT':\n      return notification.post ? `/post/${notification.post.id}` : `/profile/${notification.actor.username}`\n    case 'FOLLOW':\n      return `/profile/${notification.actor.username}`\n    default:\n      return `/profile/${notification.actor.username}`\n  }\n}\n\nexport function NotificationItem({\n  notification,\n  onMarkAsRead,\n  onMarkAsUnread,\n  onDelete,\n  className,\n}: NotificationItemProps) {\n  const [isLoading, setIsLoading] = useState(false)\n\n  const handleMarkAsRead = async () => {\n    if (isLoading || !onMarkAsRead) return\n    setIsLoading(true)\n    try {\n      await onMarkAsRead(notification.id)\n    } finally {\n      setIsLoading(false)\n    }\n  }\n\n  const handleMarkAsUnread = async () => {\n    if (isLoading || !onMarkAsUnread) return\n    setIsLoading(true)\n    try {\n      await onMarkAsUnread(notification.id)\n    } finally {\n      setIsLoading(false)\n    }\n  }\n\n  const handleDelete = async () => {\n    if (isLoading || !onDelete) return\n    setIsLoading(true)\n    try {\n      await onDelete(notification.id)\n    } finally {\n      setIsLoading(false)\n    }\n  }\n\n  const notificationLink = getNotificationLink(notification)\n  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })\n\n  return (\n    <div\n      className={cn(\n        'flex items-start gap-3 p-4 border-b border-border/50 hover:bg-muted/30 transition-colors',\n        !notification.isRead && 'bg-primary/5 border-l-2 border-l-primary',\n        className\n      )}\n    >\n      {/* Notification Icon */}\n      <div className=\"flex-shrink-0 mt-1\">\n        {getNotificationIcon(notification.type)}\n      </div>\n\n      {/* Actor Avatar */}\n      <Link href={`/profile/${notification.actor.username}`} className=\"flex-shrink-0\">\n        <Avatar className=\"h-8 w-8\">\n          <AvatarImage src={notification.actor.image || undefined} />\n          <AvatarFallback>\n            {notification.actor.name?.[0] || notification.actor.username[0]}\n          </AvatarFallback>\n        </Avatar>\n      </Link>\n\n      {/* Notification Content */}\n      <div className=\"flex-1 min-w-0\">\n        <Link href={notificationLink} className=\"block group\">\n          <p className=\"text-sm text-foreground group-hover:text-primary transition-colors\">\n            <span className=\"font-medium\">\n              {notification.actor.name || notification.actor.username}\n            </span>{' '}\n            {notification.message}\n          </p>\n          \n          {/* Post Preview */}\n          {notification.post && (\n            <p className=\"text-xs text-muted-foreground mt-1 line-clamp-2\">\n              \"{notification.post.content}\"\n            </p>\n          )}\n        </Link>\n\n        {/* Timestamp and Status */}\n        <div className=\"flex items-center gap-2 mt-2\">\n          <span className=\"text-xs text-muted-foreground\">{timeAgo}</span>\n          {!notification.isRead && (\n            <Badge variant=\"secondary\" className=\"text-xs px-1.5 py-0.5\">\n              New\n            </Badge>\n          )}\n        </div>\n      </div>\n\n      {/* Actions Menu */}\n      <div className=\"flex-shrink-0\">\n        <DropdownMenu>\n          <DropdownMenuTrigger asChild>\n            <Button\n              variant=\"ghost\"\n              size=\"sm\"\n              className=\"h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity\"\n              disabled={isLoading}\n            >\n              <MoreHorizontal className=\"h-4 w-4\" />\n            </Button>\n          </DropdownMenuTrigger>\n          <DropdownMenuContent align=\"end\" className=\"w-48\">\n            {notification.isRead ? (\n              <DropdownMenuItem onClick={handleMarkAsUnread} disabled={isLoading}>\n                <EyeOff className=\"h-4 w-4 mr-2\" />\n                Mark as unread\n              </DropdownMenuItem>\n            ) : (\n              <DropdownMenuItem onClick={handleMarkAsRead} disabled={isLoading}>\n                <Eye className=\"h-4 w-4 mr-2\" />\n                Mark as read\n              </DropdownMenuItem>\n            )}\n            <DropdownMenuItem \n              onClick={handleDelete} \n              disabled={isLoading}\n              className=\"text-destructive focus:text-destructive\"\n            >\n              <X className=\"h-4 w-4 mr-2\" />\n              Delete\n            </DropdownMenuItem>\n          </DropdownMenuContent>\n        </DropdownMenu>\n      </div>\n    </div>\n  )\n}"
    : [31;1m ^[0m
    `----


Caused by:
    Syntax Error
STACK: Error: 
  [31mx[0m Expected unicode escape
    ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\ui\notification-item.tsx[0m:46:1]
 [2m46[0m |   onMarkAsUnread?: (notificationId: string) => void
 [2m47[0m |   onDelete?: (notificationId: string) => void
 [2m48[0m |   className?: string
 [2m49[0m | }\n\nconst getNotificationIcon = (type: string) => {\n  switch (type) {\n    case 'LIKE':\n      return <Heart className=\"h-4 w-4 text-red-500\" />\n    case 'COMMENT':\n      return <MessageCircle className=\"h-4 w-4 text-blue-500\" />\n    case 'FOLLOW':\n      return <UserPlus className=\"h-4 w-4 text-green-500\" />\n    default:\n      return null\n  }\n}\n\nconst getNotificationLink = (notification: NotificationItemProps['notification']) => {\n  switch (notification.type) {\n    case 'LIKE':\n    case 'COMMENT':\n      return notification.post ? `/post/${notification.post.id}` : `/profile/${notification.actor.username}`\n    case 'FOLLOW':\n      return `/profile/${notification.actor.username}`\n    default:\n      return `/profile/${notification.actor.username}`\n  }\n}\n\nexport function NotificationItem({\n  notification,\n  onMarkAsRead,\n  onMarkAsUnread,\n  onDelete,\n  className,\n}: NotificationItemProps) {\n  const [isLoading, setIsLoading] = useState(false)\n\n  const handleMarkAsRead = async () => {\n    if (isLoading || !onMarkAsRead) return\n    setIsLoading(true)\n    try {\n      await onMarkAsRead(notification.id)\n    } finally {\n      setIsLoading(false)\n    }\n  }\n\n  const handleMarkAsUnread = async () => {\n    if (isLoading || !onMarkAsUnread) return\n    setIsLoading(true)\n    try {\n      await onMarkAsUnread(notification.id)\n    } finally {\n      setIsLoading(false)\n    }\n  }\n\n  const handleDelete = async () => {\n    if (isLoading || !onDelete) return\n    setIsLoading(true)\n    try {\n      await onDelete(notification.id)\n    } finally {\n      setIsLoading(false)\n    }\n  }\n\n  const notificationLink = getNotificationLink(notification)\n  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })\n\n  return (\n    <div\n      className={cn(\n        'flex items-start gap-3 p-4 border-b border-border/50 hover:bg-muted/30 transition-colors',\n        !notification.isRead && 'bg-primary/5 border-l-2 border-l-primary',\n        className\n      )}\n    >\n      {/* Notification Icon */}\n      <div className=\"flex-shrink-0 mt-1\">\n        {getNotificationIcon(notification.type)}\n      </div>\n\n      {/* Actor Avatar */}\n      <Link href={`/profile/${notification.actor.username}`} className=\"flex-shrink-0\">\n        <Avatar className=\"h-8 w-8\">\n          <AvatarImage src={notification.actor.image || undefined} />\n          <AvatarFallback>\n            {notification.actor.name?.[0] || notification.actor.username[0]}\n          </AvatarFallback>\n        </Avatar>\n      </Link>\n\n      {/* Notification Content */}\n      <div className=\"flex-1 min-w-0\">\n        <Link href={notificationLink} className=\"block group\">\n          <p className=\"text-sm text-foreground group-hover:text-primary transition-colors\">\n            <span className=\"font-medium\">\n              {notification.actor.name || notification.actor.username}\n            </span>{' '}\n            {notification.message}\n          </p>\n          \n          {/* Post Preview */}\n          {notification.post && (\n            <p className=\"text-xs text-muted-foreground mt-1 line-clamp-2\">\n              \"{notification.post.content}\"\n            </p>\n          )}\n        </Link>\n\n        {/* Timestamp and Status */}\n        <div className=\"flex items-center gap-2 mt-2\">\n          <span className=\"text-xs text-muted-foreground\">{timeAgo}</span>\n          {!notification.isRead && (\n            <Badge variant=\"secondary\" className=\"text-xs px-1.5 py-0.5\">\n              New\n            </Badge>\n          )}\n        </div>\n      </div>\n\n      {/* Actions Menu */}\n      <div className=\"flex-shrink-0\">\n        <DropdownMenu>\n          <DropdownMenuTrigger asChild>\n            <Button\n              variant=\"ghost\"\n              size=\"sm\"\n              className=\"h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity\"\n              disabled={isLoading}\n            >\n              <MoreHorizontal className=\"h-4 w-4\" />\n            </Button>\n          </DropdownMenuTrigger>\n          <DropdownMenuContent align=\"end\" className=\"w-48\">\n            {notification.isRead ? (\n              <DropdownMenuItem onClick={handleMarkAsUnread} disabled={isLoading}>\n                <EyeOff className=\"h-4 w-4 mr-2\" />\n                Mark as unread\n              </DropdownMenuItem>\n            ) : (\n              <DropdownMenuItem onClick={handleMarkAsRead} disabled={isLoading}>\n                <Eye className=\"h-4 w-4 mr-2\" />\n                Mark as read\n              </DropdownMenuItem>\n            )}\n            <DropdownMenuItem \n              onClick={handleDelete} \n              disabled={isLoading}\n              className=\"text-destructive focus:text-destructive\"\n            >\n              <X className=\"h-4 w-4 mr-2\" />\n              Delete\n            </DropdownMenuItem>\n          </DropdownMenuContent>\n        </DropdownMenu>\n      </div>\n    </div>\n  )\n}"
    : [31;1m ^[0m
    `----


Caused by:
    Syntax Error
    at Object.transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:821:33)
    at transformSync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\index.js:897:21)
    at process (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\next\dist\build\swc\jest-transformer.js:64:45)
    at ScriptTransformer.transformSourceAsync (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\transform\build\ScriptTransformer.js:599:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async generateEmptyCoverage (C:\Users\Sai\Desktop\Code_\kiro_test_2\node_modules\@jest\reporters\build\generateEmptyCoverage.js:127:20)
Summary of all failing tests
FAIL src/__tests__/lib/admin-auth.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/lib/admin-auth.test.ts'

    [0m [90m  6 |[39m [90m// Mock dependencies[39m
     [90m  7 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m  8 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m  9 |[39m   prisma[33m:[39m {
     [90m 10 |[39m     user[33m:[39m {
     [90m 11 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/lib/admin-auth.test.ts:8:6)

FAIL src/__tests__/hooks/use-posts.test.ts
  ● Test suite failed to run


      [31mx[0m Expected unicode escape
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\hooks\use-posts.test.ts[0m:236:1]
     [2m236[0m |       expect(mockApiPost).toHaveBeenCalledWith('/api/posts', postData)
     [2m237[0m |       expect(mockFeedStore.addPost).toHaveBeenCalledWith(mockCreatedPost)
     [2m238[0m |       expect(mockUIStore.addToast).toHaveBeenCalledWith({
     [2m239[0m |         type: 'success',\n        title: 'Post created',\n        description: 'Your post has been published successfully.',\n      })\n    })\n\n    it('should handle create post error', async () => {\n      const postData = {\n        content: 'New test post',\n      }\n\n      const errorMessage = 'Failed to create post'\n      mockApiPost.mockRejectedValue(new Error(errorMessage))\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.createPost(postData)\n      })\n\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Error',\n        description: errorMessage,\n      })\n    })\n\n    it('should validate post data before creating', async () => {\n      const invalidPostData = {\n        content: '', // Empty content\n      }\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.createPost(invalidPostData)\n      })\n\n      expect(mockApiPost).not.toHaveBeenCalled()\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Validation Error',\n        description: 'Post content is required.',\n      })\n    })\n  })\n\n  describe('updatePost', () => {\n    it('should update a post successfully', async () => {\n      const postId = 'post-1'\n      const updateData = {\n        content: 'Updated post content',\n      }\n\n      const mockUpdatedPost = {\n        ...mockPosts[0],\n        ...updateData,\n        updatedAt: new Date().toISOString(),\n      }\n\n      const mockResponse = {\n        success: true,\n        post: mockUpdatedPost,\n      }\n\n      mockApiPut.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.updatePost(postId, updateData)\n      })\n\n      expect(mockApiPut).toHaveBeenCalledWith(`/api/posts/${postId}`, updateData)\n      expect(mockFeedStore.updatePost).toHaveBeenCalledWith(mockUpdatedPost)\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'success',\n        title: 'Post updated',\n        description: 'Your post has been updated successfully.',\n      })\n    })\n\n    it('should handle update post error', async () => {\n      const postId = 'post-1'\n      const updateData = { content: 'Updated content' }\n      const errorMessage = 'Failed to update post'\n\n      mockApiPut.mockRejectedValue(new Error(errorMessage))\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.updatePost(postId, updateData)\n      })\n\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Error',\n        description: errorMessage,\n      })\n    })\n  })\n\n  describe('deletePost', () => {\n    it('should delete a post successfully', async () => {\n      const postId = 'post-1'\n      const mockResponse = {\n        success: true,\n        message: 'Post deleted successfully',\n      }\n\n      mockApiDelete.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.deletePost(postId)\n      })\n\n      expect(mockApiDelete).toHaveBeenCalledWith(`/api/posts/${postId}`)\n      expect(mockFeedStore.removePost).toHaveBeenCalledWith(postId)\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'success',\n        title: 'Post deleted',\n        description: 'Your post has been deleted successfully.',\n      })\n    })\n\n    it('should handle delete post error', async () => {\n      const postId = 'post-1'\n      const errorMessage = 'Failed to delete post'\n\n      mockApiDelete.mockRejectedValue(new Error(errorMessage))\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.deletePost(postId)\n      })\n\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Error',\n        description: errorMessage,\n      })\n    })\n  })\n\n  describe('likePost', () => {\n    it('should like a post successfully', async () => {\n      const postId = 'post-1'\n      const mockResponse = {\n        success: true,\n        liked: true,\n      }\n\n      mockApiPost.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.likePost(postId)\n      })\n\n      expect(mockApiPost).toHaveBeenCalledWith(`/api/posts/${postId}/like`)\n      expect(mockFeedStore.addOptimisticUpdate).toHaveBeenCalledWith(postId, {\n        type: 'like',\n        isLiked: true,\n        timestamp: expect.any(Number),\n      })\n    })\n\n    it('should unlike a post successfully', async () => {\n      const postId = 'post-2' // This post is already liked\n      const mockResponse = {\n        success: true,\n        liked: false,\n      }\n\n      mockApiDelete.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.likePost(postId)\n      })\n\n      expect(mockApiDelete).toHaveBeenCalledWith(`/api/posts/${postId}/like`)\n      expect(mockFeedStore.addOptimisticUpdate).toHaveBeenCalledWith(postId, {\n        type: 'like',\n        isLiked: false,\n        timestamp: expect.any(Number),\n      })\n    })\n\n    it('should handle like post error', async () => {\n      const postId = 'post-1'\n      const errorMessage = 'Failed to like post'\n\n      mockApiPost.mockRejectedValue(new Error(errorMessage))\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.likePost(postId)\n      })\n\n      expect(mockFeedStore.removeOptimisticUpdate).toHaveBeenCalledWith(postId)\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Error',\n        description: errorMessage,\n      })\n    })\n  })\n\n  describe('loadMorePosts', () => {\n    it('should load more posts successfully', async () => {\n      const existingPosts = [mockPosts[0]]\n      const newPosts = [mockPosts[1]]\n      \n      mockUseFeedStore.mockReturnValue({\n        ...mockFeedStore,\n        posts: existingPosts,\n      })\n\n      const mockResponse = {\n        success: true,\n        posts: newPosts,\n        pagination: {\n          page: 2,\n          limit: 20,\n          total: 2,\n          hasMore: false,\n        },\n      }\n\n      mockApiGet.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.loadMorePosts()\n      })\n\n      expect(mockApiGet).toHaveBeenCalledWith('/api/posts', {\n        params: {\n          page: 2,\n          limit: 20,\n          type: 'following',\n        },\n      })\n\n      expect(mockFeedStore.setPosts).toHaveBeenCalledWith([...existingPosts, ...newPosts])\n      expect(mockFeedStore.setHasMore).toHaveBeenCalledWith(false)\n    })\n\n    it('should not load more when no more posts available', async () => {\n      mockUseFeedStore.mockReturnValue({\n        ...mockFeedStore,\n        hasMore: false,\n      })\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.loadMorePosts()\n      })\n\n      expect(mockApiGet).not.toHaveBeenCalled()\n    })\n\n    it('should not load more when already loading', async () => {\n      mockUseFeedStore.mockReturnValue({\n        ...mockFeedStore,\n        loading: true,\n      })\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.loadMorePosts()\n      })\n\n      expect(mockApiGet).not.toHaveBeenCalled()\n    })\n  })\n\n  describe('refreshPosts', () => {\n    it('should refresh posts successfully', async () => {\n      const mockResponse = {\n        success: true,\n        posts: mockPosts,\n        pagination: {\n          page: 1,\n          limit: 20,\n          total: 2,\n          hasMore: false,\n        },\n      }\n\n      mockApiGet.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.refreshPosts()\n      })\n\n      expect(mockFeedStore.setError).toHaveBeenCalledWith(null)\n      expect(mockFeedStore.clearOptimisticUpdates).toHaveBeenCalled()\n      expect(mockApiGet).toHaveBeenCalledWith('/api/posts', {\n        params: {\n          page: 1,\n          limit: 20,\n          type: 'following',\n        },\n      })\n    })\n  })\n\n  describe('changeFeedType', () => {\n    it('should change feed type and refresh posts', async () => {\n      const mockResponse = {\n        success: true,\n        posts: mockPosts,\n        pagination: {\n          page: 1,\n          limit: 20,\n          total: 2,\n          hasMore: false,\n        },\n      }\n\n      mockApiGet.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.changeFeedType('discover')\n      })\n\n      expect(mockFeedStore.setFeedType).toHaveBeenCalledWith('discover')\n      expect(mockFeedStore.setPosts).toHaveBeenCalledWith([])\n      expect(mockApiGet).toHaveBeenCalledWith('/api/posts', {\n        params: {\n          page: 1,\n          limit: 20,\n          type: 'discover',\n        },\n      })\n    })\n  })\n\n  describe('Edge Cases and Error Handling', () => {\n    it('should handle network errors gracefully', async () => {\n      const networkError = new Error('Network error')\n      networkError.name = 'NetworkError'\n      \n      mockApiGet.mockRejectedValue(networkError)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.fetchPosts()\n      })\n\n      expect(mockFeedStore.setError).toHaveBeenCalledWith('Network error')\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Network Error',\n        description: 'Please check your internet connection and try again.',\n      })\n    })\n\n    it('should handle API response without posts array', async () => {\n      const mockResponse = {\n        success: true,\n        // Missing posts array\n        pagination: {\n          page: 1,\n          limit: 20,\n          total: 0,\n          hasMore: false,\n        },\n      }\n\n      mockApiGet.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.fetchPosts()\n      })\n\n      expect(mockFeedStore.setPosts).toHaveBeenCalledWith([])\n    })\n\n    it('should handle malformed API responses', async () => {\n      const malformedResponse = {\n        // Missing success field and other required fields\n        data: 'invalid',\n      }\n\n      mockApiGet.mockResolvedValue(malformedResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.fetchPosts()\n      })\n\n      expect(mockFeedStore.setError).toHaveBeenCalledWith('Invalid response format')\n    })\n  })\n\n  describe('Performance and Optimization', () => {\n    it('should debounce rapid successive calls', async () => {\n      const mockResponse = {\n        success: true,\n        posts: mockPosts,\n        pagination: { page: 1, limit: 20, total: 2, hasMore: false },\n      }\n\n      mockApiGet.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      // Make multiple rapid calls\n      await act(async () => {\n        result.current.fetchPosts()\n        result.current.fetchPosts()\n        result.current.fetchPosts()\n      })\n\n      // Should only make one API call due to debouncing\n      expect(mockApiGet).toHaveBeenCalledTimes(1)\n    })\n\n    it('should cancel previous requests when new ones are made', async () => {\n      const { result } = renderHook(() => usePosts())\n\n      // Start first request\n      act(() => {\n        result.current.fetchPosts()\n      })\n\n      // Start second request before first completes\n      await act(async () => {\n        await result.current.fetchPosts()\n      })\n\n      // Should handle request cancellation gracefully\n      expect(mockFeedStore.setLoading).toHaveBeenCalledWith(false)\n    })\n  })\n})"
         : [31;1m                        ^[0m
         `----


    Caused by:
        Syntax Error

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)

FAIL src/__tests__/stores/feed-store.test.ts
  ● Test suite failed to run

    Cannot find module '@/hooks/use-api' from 'src/__tests__/stores/feed-store.test.ts'

    [0m [90m 3 |[39m
     [90m 4 |[39m [90m// Mock API calls[39m
    [31m[1m>[22m[39m[90m 5 |[39m jest[33m.[39mmock([32m'@/hooks/use-api'[39m[33m,[39m () [33m=>[39m ({
     [90m   |[39m      [31m[1m^[22m[39m
     [90m 6 |[39m   useApi[33m:[39m () [33m=>[39m ({
     [90m 7 |[39m     [36mget[39m[33m:[39m jest[33m.[39mfn()[33m,[39m
     [90m 8 |[39m     post[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/stores/feed-store.test.ts:5:6)

FAIL src/__tests__/lib/bundle-optimization.test.ts
  ● Test suite failed to run


      [31mx[0m Expected '>', got 'fallback'
        ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\lib\bundle-optimization.ts[0m:21:1]
     [2m21[0m |   if (suspense) {
     [2m22[0m |     const LazyComponent = lazy(importFn)
     [2m23[0m |     return (props: T) => (
     [2m24[0m |       <Suspense fallback={loading ? <loading /> : <div>Loading...</div>}>
        : [31;1m                ^^^^^^^^[0m
     [2m25[0m |         <LazyComponent {...props} />
     [2m26[0m |       </Suspense>
     [2m26[0m |     )
        `----


    Caused by:
        Syntax Error

    [0m [90m 11 |[39m   [36mreturn[39m jest[33m.[39mfn((importFn) [33m=>[39m {
     [90m 12 |[39m     [36mconst[39m [33mMockComponent[39m [33m=[39m () [33m=>[39m [32m'Mocked Component'[39m
    [31m[1m>[22m[39m[90m 13 |[39m     [33mMockComponent[39m[33m.[39mdisplayName [33m=[39m [32m'MockDynamicComponent'[39m
     [90m    |[39m                             [31m[1m^[22m[39m
     [90m 14 |[39m     [36mreturn[39m [33mMockComponent[39m
     [90m 15 |[39m   })
     [90m 16 |[39m })[0m

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)
      at Object.<anonymous> (src/__tests__/lib/bundle-optimization.test.ts:13:29)

FAIL src/__tests__/integration/post-creation-flow.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/integration/post-creation-flow.test.ts'

    [0m [90m  5 |[39m [90m// Mock dependencies[39m
     [90m  6 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m  7 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m  8 |[39m   prisma[33m:[39m {
     [90m  9 |[39m     post[33m:[39m {
     [90m 10 |[39m       create[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/integration/post-creation-flow.test.ts:7:6)

FAIL src/__tests__/integration/post-interactions.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/integration/post-interactions.test.ts'

    [0m [90m  7 |[39m
     [90m  8 |[39m [90m// Mock dependencies[39m
    [31m[1m>[22m[39m[90m  9 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m 10 |[39m   prisma[33m:[39m {
     [90m 11 |[39m     post[33m:[39m {
     [90m 12 |[39m       create[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/integration/post-interactions.test.ts:9:6)

FAIL src/__tests__/integration/end-to-end-flow.test.ts
  ● Test suite failed to run


      [31mx[0m Expression expected
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\integration\end-to-end-flow.test.ts[0m:113:1]
     [2m113[0m |   describe('Complete User Journey: New User to Active Community Member', () => {
     [2m114[0m |     it('should guide a new user through the complete onboarding and engagement flow', async () => {
     [2m115[0m |       // Step 1: Landing Page Experience
     [2m116[0m |       const { rerender } = render(<LandingPage />)
         : [31;1m                                               ^[0m
     [2m117[0m |       
     [2m118[0m |       // User sees attractive landing page
     [2m118[0m |       expect(screen.getByText(/community platform/i)).toBeInTheDocument()
         `----

      [31mx[0m Expression expected
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\integration\end-to-end-flow.test.ts[0m:113:1]
     [2m113[0m |   describe('Complete User Journey: New User to Active Community Member', () => {
     [2m114[0m |     it('should guide a new user through the complete onboarding and engagement flow', async () => {
     [2m115[0m |       // Step 1: Landing Page Experience
     [2m116[0m |       const { rerender } = render(<LandingPage />)
         : [31;1m                                                ^[0m
     [2m117[0m |       
     [2m118[0m |       // User sees attractive landing page
     [2m118[0m |       expect(screen.getByText(/community platform/i)).toBeInTheDocument()
         `----

      [31mx[0m Expression expected
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\integration\end-to-end-flow.test.ts[0m:113:1]
     [2m113[0m |   describe('Complete User Journey: New User to Active Community Member', () => {
     [2m114[0m |     it('should guide a new user through the complete onboarding and engagement flow', async () => {
     [2m115[0m |       // Step 1: Landing Page Experience
     [2m116[0m |       const { rerender } = render(<LandingPage />)
         : [31;1m                                                 ^[0m
     [2m117[0m |       
     [2m118[0m |       // User sees attractive landing page
     [2m118[0m |       expect(screen.getByText(/community platform/i)).toBeInTheDocument()
         `----


    Caused by:
        Syntax Error

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)

FAIL src/__tests__/integration/complete-user-journey.test.ts
  ● Test suite failed to run


      [31mx[0m Expression expected
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\integration\complete-user-journey.test.ts[0m:173:1]
     [2m173[0m |     it('should handle authentication flow correctly', async () => {
     [2m174[0m |       const { signIn } = require('next-auth/react')
     [2m175[0m |       
     [2m176[0m |       render(<LandingPage />)
         : [31;1m                          ^[0m
     [2m177[0m |       
     [2m178[0m |       // Should show sign-in options
     [2m178[0m |       expect(screen.getByText(/sign in/i)).toBeInTheDocument()
         `----

      [31mx[0m Expression expected
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\integration\complete-user-journey.test.ts[0m:173:1]
     [2m173[0m |     it('should handle authentication flow correctly', async () => {
     [2m174[0m |       const { signIn } = require('next-auth/react')
     [2m175[0m |       
     [2m176[0m |       render(<LandingPage />)
         : [31;1m                           ^[0m
     [2m177[0m |       
     [2m178[0m |       // Should show sign-in options
     [2m178[0m |       expect(screen.getByText(/sign in/i)).toBeInTheDocument()
         `----

      [31mx[0m Expression expected
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\integration\complete-user-journey.test.ts[0m:173:1]
     [2m173[0m |     it('should handle authentication flow correctly', async () => {
     [2m174[0m |       const { signIn } = require('next-auth/react')
     [2m175[0m |       
     [2m176[0m |       render(<LandingPage />)
         : [31;1m                            ^[0m
     [2m177[0m |       
     [2m178[0m |       // Should show sign-in options
     [2m178[0m |       expect(screen.getByText(/sign in/i)).toBeInTheDocument()
         `----


    Caused by:
        Syntax Error

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)

FAIL src/__tests__/integration/auth-flow.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/integration/auth-flow.test.ts'

    [0m [90m  5 |[39m
     [90m  6 |[39m [90m// Mock Prisma[39m
    [31m[1m>[22m[39m[90m  7 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m  8 |[39m   prisma[33m:[39m {
     [90m  9 |[39m     user[33m:[39m {
     [90m 10 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/integration/auth-flow.test.ts:7:6)

FAIL src/__tests__/hooks/use-comments.test.ts (8.252 s)
  ● useComments › should fetch comments for a post

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 45 |[39m     })
     [90m 46 |[39m
    [31m[1m>[22m[39m[90m 47 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m    |[39m                                                    [31m[1m^[22m[39m
     [90m 48 |[39m
     [90m 49 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual(mockComments)
     [90m 50 |[39m     expect(result[33m.[39mcurrent[33m.[39mtotal)[33m.[39mtoBe([35m2[39m)[0m

      at src/__tests__/hooks/use-comments.test.ts:47:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:47:34)

  ● useComments › should handle loading state

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 61 |[39m     })
     [90m 62 |[39m
    [31m[1m>[22m[39m[90m 63 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m    |[39m                                                    [31m[1m^[22m[39m
     [90m 64 |[39m
     [90m 65 |[39m     expect(result[33m.[39mcurrent[33m.[39misLoading)[33m.[39mtoBe([36mtrue[39m)
     [90m 66 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual([])[0m

      at src/__tests__/hooks/use-comments.test.ts:63:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:63:34)

  ● useComments › should handle error state

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 76 |[39m     })
     [90m 77 |[39m
    [31m[1m>[22m[39m[90m 78 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m    |[39m                                                    [31m[1m^[22m[39m
     [90m 79 |[39m
     [90m 80 |[39m     expect(result[33m.[39mcurrent[33m.[39merror)[33m.[39mtoBe(error)
     [90m 81 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual([])[0m

      at src/__tests__/hooks/use-comments.test.ts:78:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:78:34)

  ● useComments › should create a new comment

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 104 |[39m     })
     [90m 105 |[39m
    [31m[1m>[22m[39m[90m 106 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                                    [31m[1m^[22m[39m
     [90m 107 |[39m
     [90m 108 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
     [90m 109 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mcreateComment([32m'New comment'[39m)[0m

      at src/__tests__/hooks/use-comments.test.ts:106:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:106:34)

  ● useComments › should handle comment creation error

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 130 |[39m     [33m;[39m(global[33m.[39mfetch [36mas[39m jest[33m.[39m[33mMock[39m)[33m.[39mmockRejectedValue([36mnew[39m [33mError[39m([32m'Network error'[39m))
     [90m 131 |[39m
    [31m[1m>[22m[39m[90m 132 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                                    [31m[1m^[22m[39m
     [90m 133 |[39m
     [90m 134 |[39m     [36mawait[39m expect(result[33m.[39mcurrent[33m.[39mcreateComment([32m'New comment'[39m))[33m.[39mrejects[33m.[39mtoThrow([32m'Network error'[39m)
     [90m 135 |[39m   })[0m

      at src/__tests__/hooks/use-comments.test.ts:132:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:132:34)

  ● useComments › should delete a comment

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 149 |[39m     })
     [90m 150 |[39m
    [31m[1m>[22m[39m[90m 151 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                                    [31m[1m^[22m[39m
     [90m 152 |[39m
     [90m 153 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
     [90m 154 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mdeleteComment([32m'comment-1'[39m)[0m

      at src/__tests__/hooks/use-comments.test.ts:151:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:151:34)

  ● useComments › should handle comment deletion error

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 173 |[39m     [33m;[39m(global[33m.[39mfetch [36mas[39m jest[33m.[39m[33mMock[39m)[33m.[39mmockRejectedValue([36mnew[39m [33mError[39m([32m'Network error'[39m))
     [90m 174 |[39m
    [31m[1m>[22m[39m[90m 175 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                                    [31m[1m^[22m[39m
     [90m 176 |[39m
     [90m 177 |[39m     [36mawait[39m expect(result[33m.[39mcurrent[33m.[39mdeleteComment([32m'comment-1'[39m))[33m.[39mrejects[33m.[39mtoThrow([32m'Network error'[39m)
     [90m 178 |[39m   })[0m

      at src/__tests__/hooks/use-comments.test.ts:175:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:175:34)

  ● useComments › should not fetch when postId is not provided

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 186 |[39m     })
     [90m 187 |[39m
    [31m[1m>[22m[39m[90m 188 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([36mnull[39m))
     [90m     |[39m                                                    [31m[1m^[22m[39m
     [90m 189 |[39m
     [90m 190 |[39m     expect(result[33m.[39mcurrent[33m.[39mcomments)[33m.[39mtoEqual([])
     [90m 191 |[39m     expect(result[33m.[39mcurrent[33m.[39mtotal)[33m.[39mtoBe([35m0[39m)[0m

      at src/__tests__/hooks/use-comments.test.ts:188:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:188:34)

  ● useComments › should refresh comments

    TypeError: (0 , _usecomments.useComments) is not a function

    [0m [90m 201 |[39m     })
     [90m 202 |[39m
    [31m[1m>[22m[39m[90m 203 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useComments([32m'post-1'[39m))
     [90m     |[39m                                                    [31m[1m^[22m[39m
     [90m 204 |[39m
     [90m 205 |[39m     [36mawait[39m result[33m.[39mcurrent[33m.[39mrefresh()
     [90m 206 |[39m[0m

      at src/__tests__/hooks/use-comments.test.ts:203:52
      at TestComponent (node_modules/@testing-library/react/dist/pure.js:331:27)
      at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
      at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
      at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
      at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:27465:14)
      at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:26599:12)
      at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:26505:5)
      at renderRootSync (node_modules/react-dom/cjs/react-dom.development.js:26473:7)
      at recoverFromConcurrentError (node_modules/react-dom/cjs/react-dom.development.js:25889:20)
      at performConcurrentWorkOnRoot (node_modules/react-dom/cjs/react-dom.development.js:25789:22)
      at flushActQueue (node_modules/react/cjs/react.development.js:2667:24)
      at act (node_modules/react/cjs/react.development.js:2582:11)
      at node_modules/@testing-library/react/dist/act-compat.js:47:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:190:26)
      at render (node_modules/@testing-library/react/dist/pure.js:292:10)
      at renderHook (node_modules/@testing-library/react/dist/pure.js:340:7)
      at Object.<anonymous> (src/__tests__/hooks/use-comments.test.ts:203:34)

FAIL src/__tests__/integration/auth-flow-simple.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/integration/auth-flow-simple.test.ts'

    [0m [90m 3 |[39m
     [90m 4 |[39m [90m// Mock Prisma[39m
    [31m[1m>[22m[39m[90m 5 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m   |[39m      [31m[1m^[22m[39m
     [90m 6 |[39m   prisma[33m:[39m {
     [90m 7 |[39m     user[33m:[39m {
     [90m 8 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/integration/auth-flow-simple.test.ts:5:6)

FAIL src/__tests__/integration/admin-functionality.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/integration/admin-functionality.test.ts'

    [0m [90m 10 |[39m
     [90m 11 |[39m [90m// Mock dependencies[39m
    [31m[1m>[22m[39m[90m 12 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m 13 |[39m   prisma[33m:[39m {
     [90m 14 |[39m     user[33m:[39m {
     [90m 15 |[39m       findMany[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/integration/admin-functionality.test.ts:12:6)

FAIL src/__tests__/components/real-time-feed.test.tsx
  ● Test suite failed to run


      [31mx[0m Unexpected token `RealTimeFeed`. Expected jsx identifier
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\components\real-time-feed.test.tsx[0m:309:1]
     [2m309[0m |       mutate: jest.fn(),
     [2m310[0m |     })
     [2m311[0m | 
     [2m312[0m |     render(<RealTimeFeed userId=\"user-1\" />)
         : [31;1m            ^^^^^^^^^^^^[0m
     [2m313[0m | 
     [2m314[0m |     expect(useSWR).toHaveBeenCalledWith(
     [2m314[0m |       '/api/posts?page=1&limit=10&userId=user-1',
         `----


    Caused by:
        Syntax Error

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)

FAIL src/__tests__/integration/admin-access-control.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/integration/admin-access-control.test.ts'

    [0m [90m  5 |[39m [90m// Mock dependencies[39m
     [90m  6 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m  7 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m  8 |[39m   prisma[33m:[39m {
     [90m  9 |[39m     user[33m:[39m {
     [90m 10 |[39m       findMany[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/integration/admin-access-control.test.ts:7:6)

FAIL src/__tests__/components/notification-dropdown.test.tsx
  ● Test suite failed to run


      [31mx[0m Unterminated string constant
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\components\notification-dropdown.test.tsx[0m:143:1]
     [2m143[0m |     fireEvent.click(screen.getByRole('button'))
     [2m144[0m |     
     [2m145[0m |     expect(screen.getByText('No notifications')).toBeInTheDocument()
     [2m146[0m |     expect(screen.getByText(\"You're all caught up!\")).toBeInTheDocument()
         : [31;1m                             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[0m
     [2m147[0m |   })
     [2m148[0m | 
     [2m148[0m |   it('should display notifications correctly', () => {
         `----

      [31mx[0m Expected unicode escape
         ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\components\notification-dropdown.test.tsx[0m:143:1]
     [2m143[0m |     fireEvent.click(screen.getByRole('button'))
     [2m144[0m |     
     [2m145[0m |     expect(screen.getByText('No notifications')).toBeInTheDocument()
     [2m146[0m |     expect(screen.getByText(\"You're all caught up!\")).toBeInTheDocument()
         : [31;1m                            ^[0m
     [2m147[0m |   })
     [2m148[0m | 
     [2m148[0m |   it('should display notifications correctly', () => {
         `----


    Caused by:
        Syntax Error

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)

FAIL src/__tests__/components/follow-button.test.tsx
  ● Test suite failed to run


      [31mx[0m Unexpected token `FollowButton`. Expected jsx identifier
        ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\components\follow-button.test.tsx[0m:25:1]
     [2m25[0m |   it('should not render when user is not authenticated', () => {
     [2m26[0m |     ;(useSession as jest.Mock).mockReturnValue({ data: null })
     [2m27[0m | 
     [2m28[0m |     const { container } = render(<FollowButton userId=\"user-2\" />)
        : [31;1m                                  ^^^^^^^^^^^^[0m
     [2m29[0m |     expect(container.firstChild).toBeNull()
     [2m30[0m |   })
     [2m30[0m | 
        `----


    Caused by:
        Syntax Error

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)

FAIL src/__tests__/components/enhanced-interactive-feed.test.tsx
  ● Test suite failed to run


      [31mx[0m Expected unicode escape
        ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\__tests__\components\enhanced-interactive-feed.test.tsx[0m:25:1]
     [2m25[0m |   root: null,
     [2m26[0m |   rootMargin: '',
     [2m27[0m |   thresholds: [],
     [2m28[0m | }))\n\n// Mock ResizeObserver\nglobal.ResizeObserver = jest.fn().mockImplementation(() => ({\n  observe: jest.fn(),\n  unobserve: jest.fn(),\n  disconnect: jest.fn(),\n}))\n\ndescribe('EnhancedInteractiveFeed', () => {\n  const mockUser = {\n    id: 'user-123',\n    username: 'testuser',\n    name: 'Test User',\n    email: 'test@example.com',\n  }\n\n  const mockSession = {\n    user: mockUser,\n    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),\n  }\n\n  const mockPosts = [\n    {\n      id: 'post-1',\n      content: 'First test post',\n      imageUrl: null,\n      createdAt: new Date().toISOString(),\n      updatedAt: new Date().toISOString(),\n      isPublic: true,\n      author: {\n        id: 'author-1',\n        username: 'author1',\n        name: 'Author One',\n        image: null,\n      },\n      _count: {\n        likes: 5,\n        comments: 2,\n      },\n      isLiked: false,\n    },\n    {\n      id: 'post-2',\n      content: 'Second test post with image',\n      imageUrl: 'https://example.com/image.jpg',\n      createdAt: new Date().toISOString(),\n      updatedAt: new Date().toISOString(),\n      isPublic: true,\n      author: {\n        id: 'author-2',\n        username: 'author2',\n        name: 'Author Two',\n        image: 'https://example.com/avatar.jpg',\n      },\n      _count: {\n        likes: 10,\n        comments: 5,\n      },\n      isLiked: true,\n    },\n  ]\n\n  const defaultFeedStore = {\n    posts: mockPosts,\n    loading: false,\n    error: null,\n    hasMore: true,\n    feedType: 'following' as const,\n    lastFetch: Date.now(),\n    optimisticUpdates: new Map(),\n    setPosts: jest.fn(),\n    addPost: jest.fn(),\n    updatePost: jest.fn(),\n    removePost: jest.fn(),\n    setLoading: jest.fn(),\n    setError: jest.fn(),\n    setHasMore: jest.fn(),\n    setFeedType: jest.fn(),\n    loadMorePosts: jest.fn(),\n    refreshFeed: jest.fn(),\n    addOptimisticUpdate: jest.fn(),\n    removeOptimisticUpdate: jest.fn(),\n    clearOptimisticUpdates: jest.fn(),\n  }\n\n  const defaultUIStore = {\n    sidebarOpen: false,\n    mobileMenuOpen: false,\n    postComposerOpen: false,\n    profileEditOpen: false,\n    isLoading: false,\n    loadingMessage: '',\n    searchQuery: '',\n    searchResults: [],\n    searchLoading: false,\n    toasts: [],\n    setSidebarOpen: jest.fn(),\n    setMobileMenuOpen: jest.fn(),\n    setPostComposerOpen: jest.fn(),\n    setProfileEditOpen: jest.fn(),\n    setLoading: jest.fn(),\n    addToast: jest.fn(),\n    removeToast: jest.fn(),\n    setSearchQuery: jest.fn(),\n    setSearchResults: jest.fn(),\n    setSearchLoading: jest.fn(),\n    clearSearch: jest.fn(),\n  }\n\n  beforeEach(() => {\n    jest.clearAllMocks()\n    mockUseSession.mockReturnValue({ data: mockSession, status: 'authenticated' })\n    mockUseFeedStore.mockReturnValue(defaultFeedStore)\n    mockUseUIStore.mockReturnValue(defaultUIStore)\n  })\n\n  it('should render feed with posts', async () => {\n    render(<EnhancedInteractiveFeed />)\n\n    await waitFor(() => {\n      expect(screen.getByText('First test post')).toBeInTheDocument()\n      expect(screen.getByText('Second test post with image')).toBeInTheDocument()\n    })\n\n    expect(screen.getByText('Author One')).toBeInTheDocument()\n    expect(screen.getByText('Author Two')).toBeInTheDocument()\n  })\n\n  it('should display loading state', () => {\n    mockUseFeedStore.mockReturnValue({\n      ...defaultFeedStore,\n      loading: true,\n      posts: [],\n    })\n\n    render(<EnhancedInteractiveFeed />)\n\n    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()\n  })\n\n  it('should display error state', () => {\n    const errorMessage = 'Failed to load posts'\n    mockUseFeedStore.mockReturnValue({\n      ...defaultFeedStore,\n      error: errorMessage,\n      posts: [],\n    })\n\n    render(<EnhancedInteractiveFeed />)\n\n    expect(screen.getByText(errorMessage)).toBeInTheDocument()\n    expect(screen.getByText('Try Again')).toBeInTheDocument()\n  })\n\n  it('should display empty state when no posts', () => {\n    mockUseFeedStore.mockReturnValue({\n      ...defaultFeedStore,\n      posts: [],\n      hasMore: false,\n    })\n\n    render(<EnhancedInteractiveFeed />)\n\n    expect(screen.getByText('No posts yet')).toBeInTheDocument()\n    expect(screen.getByText('Be the first to share something!')).toBeInTheDocument()\n  })\n\n  it('should handle feed type switching', async () => {\n    const user = userEvent.setup()\n    render(<EnhancedInteractiveFeed />)\n\n    const feedTypeSelect = screen.getByRole('combobox')\n    await user.click(feedTypeSelect)\n\n    const discoverOption = screen.getByText('Discover')\n    await user.click(discoverOption)\n\n    expect(defaultFeedStore.setFeedType).toHaveBeenCalledWith('discover')\n  })\n\n  it('should handle post liking', async () => {\n    const user = userEvent.setup()\n    render(<EnhancedInteractiveFeed />)\n\n    const likeButtons = screen.getAllByRole('button', { name: /like/i })\n    await user.click(likeButtons[0]) // Like first post\n\n    expect(defaultFeedStore.addOptimisticUpdate).toHaveBeenCalledWith(\n      'post-1',\n      expect.objectContaining({\n        type: 'like',\n        isLiked: true,\n      })\n    )\n  })\n\n  it('should handle post commenting', async () => {\n    const user = userEvent.setup()\n    render(<EnhancedInteractiveFeed />)\n\n    const commentButtons = screen.getAllByRole('button', { name: /comment/i })\n    await user.click(commentButtons[0])\n\n    const commentInput = screen.getByPlaceholderText('Write a comment...')\n    await user.type(commentInput, 'This is a test comment')\n\n    const submitButton = screen.getByRole('button', { name: /post comment/i })\n    await user.click(submitButton)\n\n    expect(defaultFeedStore.addOptimisticUpdate).toHaveBeenCalledWith(\n      'post-1',\n      expect.objectContaining({\n        type: 'comment',\n      })\n    )\n  })\n\n  it('should handle infinite scrolling', async () => {\n    const mockIntersectionObserver = jest.fn()\n    mockIntersectionObserver.mockReturnValue({\n      observe: () => null,\n      unobserve: () => null,\n      disconnect: () => null,\n    })\n    global.IntersectionObserver = mockIntersectionObserver\n\n    render(<EnhancedInteractiveFeed />)\n\n    // Simulate intersection observer callback\n    const [callback] = mockIntersectionObserver.mock.calls[0]\n    act(() => {\n      callback([{ isIntersecting: true }])\n    })\n\n    expect(defaultFeedStore.loadMorePosts).toHaveBeenCalled()\n  })\n\n  it('should handle pull-to-refresh', async () => {\n    const user = userEvent.setup()\n    render(<EnhancedInteractiveFeed />)\n\n    const feedContainer = screen.getByTestId('feed-container')\n    \n    // Simulate pull-to-refresh gesture\n    fireEvent.touchStart(feedContainer, {\n      touches: [{ clientY: 100 }],\n    })\n    \n    fireEvent.touchMove(feedContainer, {\n      touches: [{ clientY: 200 }],\n    })\n    \n    fireEvent.touchEnd(feedContainer)\n\n    await waitFor(() => {\n      expect(defaultFeedStore.refreshFeed).toHaveBeenCalled()\n    })\n  })\n\n  it('should display post composer when authenticated', () => {\n    render(<EnhancedInteractiveFeed />)\n\n    expect(screen.getByPlaceholderText(\"What's on your mind?\")).toBeInTheDocument()\n  })\n\n  it('should not display post composer when unauthenticated', () => {\n    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })\n\n    render(<EnhancedInteractiveFeed />)\n\n    expect(screen.queryByPlaceholderText(\"What's on your mind?\")).not.toBeInTheDocument()\n  })\n\n  it('should handle post creation', async () => {\n    const user = userEvent.setup()\n    render(<EnhancedInteractiveFeed />)\n\n    const postInput = screen.getByPlaceholderText(\"What's on your mind?\")\n    await user.click(postInput)\n\n    expect(defaultUIStore.setPostComposerOpen).toHaveBeenCalledWith(true)\n  })\n\n  it('should display optimistic updates', () => {\n    const optimisticUpdates = new Map([\n      ['post-1', {\n        type: 'like',\n        isLiked: true,\n        timestamp: Date.now(),\n      }],\n    ])\n\n    mockUseFeedStore.mockReturnValue({\n      ...defaultFeedStore,\n      optimisticUpdates,\n    })\n\n    render(<EnhancedInteractiveFeed />)\n\n    // The first post should show as liked due to optimistic update\n    const likeButtons = screen.getAllByRole('button', { name: /like/i })\n    expect(likeButtons[0]).toHaveClass('text-red-500') // Assuming liked state styling\n  })\n\n  it('should handle network errors gracefully', async () => {\n    const user = userEvent.setup()\n    mockUseFeedStore.mockReturnValue({\n      ...defaultFeedStore,\n      error: 'Network error',\n    })\n\n    render(<EnhancedInteractiveFeed />)\n\n    expect(screen.getByText('Network error')).toBeInTheDocument()\n    \n    const retryButton = screen.getByText('Try Again')\n    await user.click(retryButton)\n\n    expect(defaultFeedStore.refreshFeed).toHaveBeenCalled()\n  })\n\n  it('should handle real-time updates', () => {\n    const { rerender } = render(<EnhancedInteractiveFeed />)\n\n    // Simulate new post arriving via real-time update\n    const newPost = {\n      id: 'post-3',\n      content: 'New real-time post',\n      imageUrl: null,\n      createdAt: new Date().toISOString(),\n      updatedAt: new Date().toISOString(),\n      isPublic: true,\n      author: {\n        id: 'author-3',\n        username: 'author3',\n        name: 'Author Three',\n        image: null,\n      },\n      _count: {\n        likes: 0,\n        comments: 0,\n      },\n      isLiked: false,\n    }\n\n    mockUseFeedStore.mockReturnValue({\n      ...defaultFeedStore,\n      posts: [newPost, ...mockPosts],\n    })\n\n    rerender(<EnhancedInteractiveFeed />)\n\n    expect(screen.getByText('New real-time post')).toBeInTheDocument()\n  })\n\n  it('should handle keyboard navigation', async () => {\n    const user = userEvent.setup()\n    render(<EnhancedInteractiveFeed />)\n\n    const firstPost = screen.getByText('First test post').closest('[data-testid=\"post-item\"]')\n    \n    // Focus on first post\n    if (firstPost) {\n      firstPost.focus()\n      \n      // Navigate with arrow keys\n      await user.keyboard('{ArrowDown}')\n      \n      const secondPost = screen.getByText('Second test post with image').closest('[data-testid=\"post-item\"]')\n      expect(secondPost).toHaveFocus()\n    }\n  })\n\n  it('should handle accessibility features', () => {\n    render(<EnhancedInteractiveFeed />)\n\n    // Check for proper ARIA labels\n    expect(screen.getByRole('main')).toBeInTheDocument()\n    expect(screen.getByRole('feed')).toBeInTheDocument()\n    \n    // Check for screen reader announcements\n    const posts = screen.getAllByRole('article')\n    posts.forEach(post => {\n      expect(post).toHaveAttribute('aria-label')\n    })\n  })\n\n  it('should handle performance optimization', () => {\n    // Test virtualization for large lists\n    const manyPosts = Array.from({ length: 100 }, (_, i) => ({\n      ...mockPosts[0],\n      id: `post-${i}`,\n      content: `Post ${i}`,\n    }))\n\n    mockUseFeedStore.mockReturnValue({\n      ...defaultFeedStore,\n      posts: manyPosts,\n    })\n\n    render(<EnhancedInteractiveFeed />)\n\n    // Should only render visible posts (virtualization)\n    const renderedPosts = screen.getAllByRole('article')\n    expect(renderedPosts.length).toBeLessThan(manyPosts.length)\n  })\n\n  it('should handle feed filtering and sorting', async () => {\n    const user = userEvent.setup()\n    render(<EnhancedInteractiveFeed />)\n\n    // Test sorting options\n    const sortButton = screen.getByRole('button', { name: /sort/i })\n    await user.click(sortButton)\n\n    const popularOption = screen.getByText('Most Popular')\n    await user.click(popularOption)\n\n    expect(defaultFeedStore.setFeedType).toHaveBeenCalledWith('trending')\n  })\n\n  it('should handle post sharing', async () => {\n    const user = userEvent.setup()\n    \n    // Mock navigator.share\n    Object.assign(navigator, {\n      share: jest.fn().mockResolvedValue(undefined),\n    })\n\n    render(<EnhancedInteractiveFeed />)\n\n    const shareButtons = screen.getAllByRole('button', { name: /share/i })\n    await user.click(shareButtons[0])\n\n    expect(navigator.share).toHaveBeenCalledWith({\n      title: 'Post by Author One',\n      text: 'First test post',\n      url: expect.stringContaining('post-1'),\n    })\n  })\n})"
        : [31;1m     ^[0m
        `----


    Caused by:
        Syntax Error

      at Object.transformSync (node_modules/next/src/build/swc/index.ts:1433:25)
      at transformSync (node_modules/next/src/build/swc/index.ts:1550:19)
      at Object.process (node_modules/next/src/build/swc/jest-transformer.ts:104:25)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:545:31)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)

FAIL src/__tests__/api/posts.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/api/posts.test.ts'

    [0m [90m  7 |[39m [90m// Mock dependencies[39m
     [90m  8 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m  9 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m 10 |[39m   prisma[33m:[39m {
     [90m 11 |[39m     post[33m:[39m {
     [90m 12 |[39m       findMany[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/api/posts.test.ts:9:6)

FAIL src/__tests__/components/theme-toggle.test.tsx (9.94 s)
  ● ThemeToggle › should render theme toggle button

    TestingLibraryElementError: Unable to find an element by: [data-testid="sun-icon"]

    Ignored nodes: comments, script, style
    [36m<body>[39m
      [36m<div>[39m
        [36m<button[39m
          [33maria-expanded[39m=[32m"false"[39m
          [33maria-haspopup[39m=[32m"menu"[39m
          [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md h-9 w-9 px-0"[39m
          [33mdata-state[39m=[32m"closed"[39m
          [33mid[39m=[32m"radix-:r0:"[39m
          [33mtype[39m=[32m"button"[39m
        [36m>[39m
          [36m<svg[39m
            [33mclass[39m=[32m"lucide lucide-sun h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<circle[39m
              [33mcx[39m=[32m"12"[39m
              [33mcy[39m=[32m"12"[39m
              [33mr[39m=[32m"4"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M12 2v2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M12 20v2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m4.93 4.93 1.41 1.41"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m17.66 17.66 1.41 1.41"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M2 12h2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M20 12h2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m6.34 17.66-1.41 1.41"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m19.07 4.93-1.41 1.41"[39m
            [36m/>[39m
          [36m</svg>[39m
          [36m<svg[39m
            [33mclass[39m=[32m"lucide lucide-moon absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<path[39m
              [33md[39m=[32m"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"[39m
            [36m/>[39m
          [36m</svg>[39m
          [36m<span[39m
            [33mclass[39m=[32m"sr-only"[39m
          [36m>[39m
            [0mToggle theme[0m
          [36m</span>[39m
        [36m</button>[39m
      [36m</div>[39m
    [36m</body>[39m

    [0m [90m 22 |[39m
     [90m 23 |[39m     expect(screen[33m.[39mgetByRole([32m'button'[39m))[33m.[39mtoBeInTheDocument()
    [31m[1m>[22m[39m[90m 24 |[39m     expect(screen[33m.[39mgetByTestId([32m'sun-icon'[39m))[33m.[39mtoBeInTheDocument()
     [90m    |[39m                   [31m[1m^[22m[39m
     [90m 25 |[39m   })
     [90m 26 |[39m
     [90m 27 |[39m   it([32m'should show moon icon in dark theme'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.getElementError (node_modules/@testing-library/dom/dist/config.js:37:19)
      at node_modules/@testing-library/dom/dist/query-helpers.js:76:38
      at node_modules/@testing-library/dom/dist/query-helpers.js:52:17
      at node_modules/@testing-library/dom/dist/query-helpers.js:95:19
      at Object.getByTestId (src/__tests__/components/theme-toggle.test.tsx:24:19)

  ● ThemeToggle › should show moon icon in dark theme

    TestingLibraryElementError: Unable to find an element by: [data-testid="moon-icon"]

    Ignored nodes: comments, script, style
    [36m<body>[39m
      [36m<div>[39m
        [36m<button[39m
          [33maria-expanded[39m=[32m"false"[39m
          [33maria-haspopup[39m=[32m"menu"[39m
          [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md h-9 w-9 px-0"[39m
          [33mdata-state[39m=[32m"closed"[39m
          [33mid[39m=[32m"radix-:r2:"[39m
          [33mtype[39m=[32m"button"[39m
        [36m>[39m
          [36m<svg[39m
            [33mclass[39m=[32m"lucide lucide-sun h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<circle[39m
              [33mcx[39m=[32m"12"[39m
              [33mcy[39m=[32m"12"[39m
              [33mr[39m=[32m"4"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M12 2v2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M12 20v2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m4.93 4.93 1.41 1.41"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m17.66 17.66 1.41 1.41"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M2 12h2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M20 12h2"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m6.34 17.66-1.41 1.41"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"m19.07 4.93-1.41 1.41"[39m
            [36m/>[39m
          [36m</svg>[39m
          [36m<svg[39m
            [33mclass[39m=[32m"lucide lucide-moon absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<path[39m
              [33md[39m=[32m"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"[39m
            [36m/>[39m
          [36m</svg>[39m
          [36m<span[39m
            [33mclass[39m=[32m"sr-only"[39m
          [36m>[39m
            [0mToggle theme[0m
          [36m</span>[39m
        [36m</button>[39m
      [36m</div>[39m
    [36m</body>[39m

    [0m [90m 33 |[39m     render([33m<[39m[33mThemeToggle[39m [33m/[39m[33m>[39m)
     [90m 34 |[39m
    [31m[1m>[22m[39m[90m 35 |[39m     expect(screen[33m.[39mgetByTestId([32m'moon-icon'[39m))[33m.[39mtoBeInTheDocument()
     [90m    |[39m                   [31m[1m^[22m[39m
     [90m 36 |[39m   })
     [90m 37 |[39m
     [90m 38 |[39m   it([32m'should toggle to dark theme when clicked in light mode'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.getElementError (node_modules/@testing-library/dom/dist/config.js:37:19)
      at node_modules/@testing-library/dom/dist/query-helpers.js:76:38
      at node_modules/@testing-library/dom/dist/query-helpers.js:52:17
      at node_modules/@testing-library/dom/dist/query-helpers.js:95:19
      at Object.getByTestId (src/__tests__/components/theme-toggle.test.tsx:35:19)

  ● ThemeToggle › should toggle to dark theme when clicked in light mode

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "dark"

    Number of calls: 0

    [0m [90m 48 |[39m     fireEvent[33m.[39mclick(button)
     [90m 49 |[39m
    [31m[1m>[22m[39m[90m 50 |[39m     expect(mockSetTheme)[33m.[39mtoHaveBeenCalledWith([32m'dark'[39m)
     [90m    |[39m                          [31m[1m^[22m[39m
     [90m 51 |[39m   })
     [90m 52 |[39m
     [90m 53 |[39m   it([32m'should toggle to light theme when clicked in dark mode'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.toHaveBeenCalledWith (src/__tests__/components/theme-toggle.test.tsx:50:26)

  ● ThemeToggle › should toggle to light theme when clicked in dark mode

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "light"

    Number of calls: 0

    [0m [90m 63 |[39m     fireEvent[33m.[39mclick(button)
     [90m 64 |[39m
    [31m[1m>[22m[39m[90m 65 |[39m     expect(mockSetTheme)[33m.[39mtoHaveBeenCalledWith([32m'light'[39m)
     [90m    |[39m                          [31m[1m^[22m[39m
     [90m 66 |[39m   })
     [90m 67 |[39m
     [90m 68 |[39m   it([32m'should handle system theme'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.toHaveBeenCalledWith (src/__tests__/components/theme-toggle.test.tsx:65:26)

  ● ThemeToggle › should have proper accessibility attributes

    expect(element).toHaveAttribute("aria-label", StringContaining "theme") // element.getAttribute("aria-label") === StringContaining "theme"

    Expected the element to have attribute:
      aria-label=StringContaining "theme"
    Received:
      null

    [0m [90m 86 |[39m
     [90m 87 |[39m     [36mconst[39m button [33m=[39m screen[33m.[39mgetByRole([32m'button'[39m)
    [31m[1m>[22m[39m[90m 88 |[39m     expect(button)[33m.[39mtoHaveAttribute([32m'aria-label'[39m[33m,[39m expect[33m.[39mstringContaining([32m'theme'[39m))
     [90m    |[39m                    [31m[1m^[22m[39m
     [90m 89 |[39m   })
     [90m 90 |[39m
     [90m 91 |[39m   it([32m'should apply custom className when provided'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.toHaveAttribute (src/__tests__/components/theme-toggle.test.tsx:88:20)

  ● ThemeToggle › should apply custom className when provided

    expect(element).toHaveClass("custom-class")

    Expected the element to have class:
      custom-class
    Received:
      inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md h-9 w-9 px-0

    [0m [90m  98 |[39m
     [90m  99 |[39m     [36mconst[39m button [33m=[39m screen[33m.[39mgetByRole([32m'button'[39m)
    [31m[1m>[22m[39m[90m 100 |[39m     expect(button)[33m.[39mtoHaveClass([32m'custom-class'[39m)
     [90m     |[39m                    [31m[1m^[22m[39m
     [90m 101 |[39m   })
     [90m 102 |[39m
     [90m 103 |[39m   it([32m'should handle undefined theme gracefully'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.toHaveClass (src/__tests__/components/theme-toggle.test.tsx:100:20)

FAIL src/__tests__/api/users.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/db' from 'src/__tests__/api/users.test.ts'

    [0m [90m  6 |[39m [90m// Mock dependencies[39m
     [90m  7 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m  8 |[39m jest[33m.[39mmock([32m'@/lib/db'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m  9 |[39m   prisma[33m:[39m {
     [90m 10 |[39m     user[33m:[39m {
     [90m 11 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/api/users.test.ts:8:6)

FAIL src/__tests__/api/notifications.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/api/notifications.test.ts'

    [0m [90m  7 |[39m [90m// Mock dependencies[39m
     [90m  8 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m  9 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m 10 |[39m   prisma[33m:[39m {
     [90m 11 |[39m     notification[33m:[39m {
     [90m 12 |[39m       findMany[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/api/notifications.test.ts:9:6)

FAIL src/__tests__/components/post-item.test.tsx (10.385 s)
  ● PostItem › should handle bookmark action

    TestingLibraryElementError: Found multiple elements with the role "button" and name ""

    Here are the matching elements:

    Ignored nodes: comments, script, style
    [36m<button[39m
      [33maria-expanded[39m=[32m"false"[39m
      [33maria-haspopup[39m=[32m"menu"[39m
      [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0"[39m
      [33mdata-state[39m=[32m"closed"[39m
      [33mid[39m=[32m"radix-:ra:"[39m
      [33mtype[39m=[32m"button"[39m
    [36m>[39m
      [36m<svg[39m
        [33mclass[39m=[32m"lucide lucide-ellipsis h-4 w-4"[39m
        [33mfill[39m=[32m"none"[39m
        [33mheight[39m=[32m"24"[39m
        [33mstroke[39m=[32m"currentColor"[39m
        [33mstroke-linecap[39m=[32m"round"[39m
        [33mstroke-linejoin[39m=[32m"round"[39m
        [33mstroke-width[39m=[32m"2"[39m
        [33mviewBox[39m=[32m"0 0 24 24"[39m
        [33mwidth[39m=[32m"24"[39m
        [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
      [36m>[39m
        [36m<circle[39m
          [33mcx[39m=[32m"12"[39m
          [33mcy[39m=[32m"12"[39m
          [33mr[39m=[32m"1"[39m
        [36m/>[39m
        [36m<circle[39m
          [33mcx[39m=[32m"19"[39m
          [33mcy[39m=[32m"12"[39m
          [33mr[39m=[32m"1"[39m
        [36m/>[39m
        [36m<circle[39m
          [33mcx[39m=[32m"5"[39m
          [33mcy[39m=[32m"12"[39m
          [33mr[39m=[32m"1"[39m
        [36m/>[39m
      [36m</svg>[39m
    [36m</button>[39m

    Ignored nodes: comments, script, style
    [36m<button[39m
      [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 text-muted-foreground hover:text-yellow-500"[39m
    [36m>[39m
      [36m<svg[39m
        [33mclass[39m=[32m"lucide lucide-bookmark h-4 w-4"[39m
        [33mfill[39m=[32m"none"[39m
        [33mheight[39m=[32m"24"[39m
        [33mstroke[39m=[32m"currentColor"[39m
        [33mstroke-linecap[39m=[32m"round"[39m
        [33mstroke-linejoin[39m=[32m"round"[39m
        [33mstroke-width[39m=[32m"2"[39m
        [33mviewBox[39m=[32m"0 0 24 24"[39m
        [33mwidth[39m=[32m"24"[39m
        [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
      [36m>[39m
        [36m<path[39m
          [33md[39m=[32m"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"[39m
        [36m/>[39m
      [36m</svg>[39m
    [36m</button>[39m

    (If this is intentional, then use the `*AllBy*` variant of the query (like `queryAllByText`, `getAllByText`, or `findAllByText`)).

    Ignored nodes: comments, script, style
    [36m<body>[39m
      [36m<div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"rounded-lg border bg-card text-card-foreground shadow-sm w-full"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"flex flex-col space-y-1.5 p-6 pb-3"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"flex items-start justify-between"[39m
            [36m>[39m
              [36m<a[39m
                [33mclass[39m=[32m"hover:opacity-80 transition-opacity"[39m
                [33mhref[39m=[32m"/profile/postauthor"[39m
              [36m>[39m
                [36m<div[39m
                  [33mclass[39m=[32m"flex items-center gap-2"[39m
                [36m>[39m
                  [36m<span[39m
                    [33mclass[39m=[32m"relative flex shrink-0 overflow-hidden rounded-full h-8 w-8"[39m
                  [36m>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"flex h-full w-full items-center justify-center rounded-full bg-muted text-sm"[39m
                    [36m>[39m
                      [0mPA[0m
                    [36m</span>[39m
                  [36m</span>[39m
                  [36m<div[39m
                    [33mclass[39m=[32m"flex flex-col min-w-0"[39m
                  [36m>[39m
                    [36m<div[39m
                      [33mclass[39m=[32m"flex items-center gap-2"[39m
                    [36m>[39m
                      [36m<span[39m
                        [33mclass[39m=[32m"font-medium truncate text-base"[39m
                      [36m>[39m
                        [0mPost Author[0m
                      [36m</span>[39m
                    [36m</div>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-muted-foreground truncate text-sm"[39m
                    [36m>[39m
                      [0m@[0m
                      [0mpostauthor[0m
                    [36m</span>[39m
                  [36m</div>[39m
                [36m</div>[39m
              [36m</a>[39m
              [36m<div[39m
                [33mclass[39m=[32m"flex items-center gap-2"[39m
              [36m>[39m
                [36m<span[39m
                  [33mclass[39m=[32m"text-sm text-muted-foreground"[39m
                [36m>[39m
                  [0mJanuary 1, 2024[0m
                [36m</span>[39m
                [36m<button[39m
                  [33maria-expanded[39m=[32m"false"[39m
                  [33maria-haspopup[39m=[32m"menu"[39m
                  [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0"[39m
                  [33mdata-state[39m=[32m"closed"[39m
                  [33mid[39m=[32m"radix-:ra:"[39m
                  [33mtype[39m=[32m"button"[39m
                [36m>[39m
                  [36m<svg[39m
                    [33mclass[39m=[32m"lucide lucide-ellipsis h-4 w-4"[39m
                    [33mfill[39m=[32m"none"[39m
                    [33mheight[39m=[32m"24"[39m
                    [33mstroke[39m=[32m"currentColor"[39m
                    [33mstroke-linecap[39m=[32m"round"[39m
                    [33mstroke-linejoin[39m=[32m"round"[39m
                    [33mstroke-width[39m=[32m"2"[39m
                    [33mviewBox[39m=[32m"0 0 24 24"[39m
                    [33mwidth[39m=[32m"24"[39m
                    [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                  [36m>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"12"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"19"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"5"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                  [36m</svg>[39m
                [36m</button>[39m
              [36m</div>[39m
            [36m</div>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"p-6 pt-0"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"space-y-3"[39m
            [36m>[39m
              [36m<div[39m
                [33mclass[39m=[32m"text-sm leading-relaxed whitespace-pre-wrap"[39m
              [36m>[39m
                [0mThis is a test post content[0m
              [36m</div>[39m
              [36m<div[39m
                [33mclass[39m=[32m"flex items-center justify-between pt-2 border-t"[39m
              [36m>[39m
                [36m<div[39m
                  [33mclass[39m=[32m"flex items-center gap-4"[39m
                [36m>[39m
                  [36m<button[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-red-500"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-heart h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0m5[0m
                    [36m</span>[39m
                  [36m</button>[39m
                  [36m<a[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-blue-500"[39m
                    [33mhref[39m=[32m"/post/post-1"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-message-circle h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M7.9 20A9 9 0 1 0 4 16.1L2 22Z"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0m3[0m
                    [36m</span>[39m
                  [36m</a>[39m
                  [36m<button[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-green-500"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-share h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"[39m
                      [36m/>[39m
                      [36m<polyline[39m
                        [33mpoints[39m=[32m"16 6 12 2 8 6"[39m
                      [36m/>[39m
                      [36m<line[39m
                        [33mx1[39m=[32m"12"[39m
                        [33mx2[39m=[32m"12"[39m
                        [33my1[39m=[32m"2"[39m
                        [33my2[39m=[32m"15"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0mShare[0m
                    [36m</span>[39m
                  [36m</button>[39m
                [36m</div>[39m
                [36m<button[39m
                  [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 text-muted-foreground hover:text-yellow-500"[39m
                [36m>[39m
                  [36m<svg[39m
                    [33mclass[39m=[32m"lucide lucide-bookmark h-4 w-4"[39m
                    [33mfill[39m=[32m"none"[39m
                    [33mheight[39m=[32m"24"[39m
                    [33mstroke[39m=[32m"currentColor"[39m
                    [33mstroke-linecap[39m=[32m"round"[39m
                    [33mstroke-linejoin[39m=[32m"round"[39m
                    [33mstroke-width[39m=[32m"2"[39m
                    [33mviewBox[39m=[32m"0 0 24 24"[39m
                    [33mwidth[39m=[32m"24"[39m
                    [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                  [36m>[39m
                    [36m<path[39m
                      [33md[39m=[32m"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"[39m
                    [36m/>[39m
                  [36m</svg>[39m
                [36m</button>[39m
              [36m</div>[39m
            [36m</div>[39m
          [36m</div>[39m
        [36m</div>[39m
      [36m</div>[39m
    [36m</body>[39m

    [0m [90m 70 |[39m     render([33m<[39m[33mPostItem[39m post[33m=[39m{mockPost} onBookmark[33m=[39m{mockOnBookmark} [33m/[39m[33m>[39m)
     [90m 71 |[39m
    [31m[1m>[22m[39m[90m 72 |[39m     [36mconst[39m bookmarkButton [33m=[39m screen[33m.[39mgetByRole([32m'button'[39m[33m,[39m { name[33m:[39m [32m''[39m })[33m.[39mclosest([32m'button'[39m)
     [90m    |[39m                                   [31m[1m^[22m[39m
     [90m 73 |[39m     [90m// Find the bookmark button (last button without text)[39m
     [90m 74 |[39m     [36mconst[39m buttons [33m=[39m screen[33m.[39mgetAllByRole([32m'button'[39m)
     [90m 75 |[39m     [36mconst[39m bookmarkBtn [33m=[39m buttons[buttons[33m.[39mlength [33m-[39m [35m1[39m][0m

      at Object.getElementError (node_modules/@testing-library/dom/dist/config.js:37:19)
      at getElementError (node_modules/@testing-library/dom/dist/query-helpers.js:20:35)
      at getMultipleElementsFoundError (node_modules/@testing-library/dom/dist/query-helpers.js:23:10)
      at node_modules/@testing-library/dom/dist/query-helpers.js:55:13
      at node_modules/@testing-library/dom/dist/query-helpers.js:95:19
      at Object.getByRole (src/__tests__/components/post-item.test.tsx:72:35)

  ● PostItem › should show delete option for post author

    TestingLibraryElementError: Unable to find an element with the text: Delete post. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

    Ignored nodes: comments, script, style
    [36m<body>[39m
      [36m<div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"rounded-lg border bg-card text-card-foreground shadow-sm w-full"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"flex flex-col space-y-1.5 p-6 pb-3"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"flex items-start justify-between"[39m
            [36m>[39m
              [36m<a[39m
                [33mclass[39m=[32m"hover:opacity-80 transition-opacity"[39m
                [33mhref[39m=[32m"/profile/postauthor"[39m
              [36m>[39m
                [36m<div[39m
                  [33mclass[39m=[32m"flex items-center gap-2"[39m
                [36m>[39m
                  [36m<span[39m
                    [33mclass[39m=[32m"relative flex shrink-0 overflow-hidden rounded-full h-8 w-8"[39m
                  [36m>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"flex h-full w-full items-center justify-center rounded-full bg-muted text-sm"[39m
                    [36m>[39m
                      [0mPA[0m
                    [36m</span>[39m
                  [36m</span>[39m
                  [36m<div[39m
                    [33mclass[39m=[32m"flex flex-col min-w-0"[39m
                  [36m>[39m
                    [36m<div[39m
                      [33mclass[39m=[32m"flex items-center gap-2"[39m
                    [36m>[39m
                      [36m<span[39m
                        [33mclass[39m=[32m"font-medium truncate text-base"[39m
                      [36m>[39m
                        [0mPost Author[0m
                      [36m</span>[39m
                    [36m</div>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-muted-foreground truncate text-sm"[39m
                    [36m>[39m
                      [0m@[0m
                      [0mpostauthor[0m
                    [36m</span>[39m
                  [36m</div>[39m
                [36m</div>[39m
              [36m</a>[39m
              [36m<div[39m
                [33mclass[39m=[32m"flex items-center gap-2"[39m
              [36m>[39m
                [36m<span[39m
                  [33mclass[39m=[32m"text-sm text-muted-foreground"[39m
                [36m>[39m
                  [0mJanuary 1, 2024[0m
                [36m</span>[39m
                [36m<button[39m
                  [33maria-expanded[39m=[32m"false"[39m
                  [33maria-haspopup[39m=[32m"menu"[39m
                  [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0"[39m
                  [33mdata-state[39m=[32m"closed"[39m
                  [33mid[39m=[32m"radix-:ri:"[39m
                  [33mtype[39m=[32m"button"[39m
                [36m>[39m
                  [36m<svg[39m
                    [33mclass[39m=[32m"lucide lucide-ellipsis h-4 w-4"[39m
                    [33mfill[39m=[32m"none"[39m
                    [33mheight[39m=[32m"24"[39m
                    [33mstroke[39m=[32m"currentColor"[39m
                    [33mstroke-linecap[39m=[32m"round"[39m
                    [33mstroke-linejoin[39m=[32m"round"[39m
                    [33mstroke-width[39m=[32m"2"[39m
                    [33mviewBox[39m=[32m"0 0 24 24"[39m
                    [33mwidth[39m=[32m"24"[39m
                    [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                  [36m>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"12"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"19"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"5"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                  [36m</svg>[39m
                [36m</button>[39m
              [36m</div>[39m
            [36m</div>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"p-6 pt-0"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"space-y-3"[39m
            [36m>[39m
              [36m<div[39m
                [33mclass[39m=[32m"text-sm leading-relaxed whitespace-pre-wrap"[39m
              [36m>[39m
                [0mThis is a test post content[0m
              [36m</div>[39m
              [36m<div[39m
                [33mclass[39m=[32m"flex items-center justify-between pt-2 border-t"[39m
              [36m>[39m
                [36m<div[39m
                  [33mclass[39m=[32m"flex items-center gap-4"[39m
                [36m>[39m
                  [36m<button[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-red-500"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-heart h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0m5[0m
                    [36m</span>[39m
                  [36m</button>[39m
                  [36m<a[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-blue-500"[39m
                    [33mhref[39m=[32m"/post/post-1"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-message-circle h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M7.9 20A9 9 0 1 0 4 16.1L2 22Z"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0m3[0m
                    [36m</span>[39m
                  [36m</a>[39m
                  [36m<button[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-green-500"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-share h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"[39m
                      [36m/>[39m
                      [36m<polyline[39m
                        [33mpoints[39m=[32m"16 6 12 2 8 6"[39m
                      [36m/>[39m
                      [36m<line[39m
                        [33mx1[39m=[32m"12"[39m
                        [33mx2[39m=[32m"12"[39m
                        [33my1[39m=[32m"2"[39m
                        [33my2[39m=[32m"15"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0mShare[0m
                    [36m</span>[39m
                  [36m</button>[39m
                [36m</div>[39m
                [36m<button[39m
                  [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 text-muted-foreground hover:text-yellow-500"[39m
                [36m>[39m
                  [36m<svg[39m
                    [33mclass[39m=[32m"lucide lucide-bookmark h-4 w-4"[39m
                    [33mfill[39m=[32m"none"[39m
                    [33mheight[39m=[32m"24"[39m
                    [33mstroke[39m=[32m"currentColor"[39m
                    [33mstroke-linecap[39m=[32m"round"[39m
                    [33mstroke-linejoin[39m=[32m"round"[39m
                    [33mstroke-width[39m=[32m"2"[39m
                    [33mviewBox[39m=[32m"0 0 24 24"[39m
                    [33mwidth[39m=[32m"24"[39m
                    [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                  [36m>[39m
                    [36m<path[39m
                      [33md[39m=[32m"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"[39m
                    [36m/>[39m
                  [36m</svg>[39m
                [36m</button>[39m
              [36m</div>[39m
            [36m</div>[39m
          [36m</div>[39m
        [36m</div>[39m
      [36m</div>[39m
    [36m</body>[39m

    [0m [90m 108 |[39m     fireEvent[33m.[39mclick(dropdownTrigger)
     [90m 109 |[39m
    [31m[1m>[22m[39m[90m 110 |[39m     expect(screen[33m.[39mgetByText([32m'Delete post'[39m))[33m.[39mtoBeInTheDocument()
     [90m     |[39m                   [31m[1m^[22m[39m
     [90m 111 |[39m   })
     [90m 112 |[39m
     [90m 113 |[39m   it([32m'should show report option for other users'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.getElementError (node_modules/@testing-library/dom/dist/config.js:37:19)
      at node_modules/@testing-library/dom/dist/query-helpers.js:76:38
      at node_modules/@testing-library/dom/dist/query-helpers.js:52:17
      at node_modules/@testing-library/dom/dist/query-helpers.js:95:19
      at Object.getByText (src/__tests__/components/post-item.test.tsx:110:19)

  ● PostItem › should show report option for other users

    TestingLibraryElementError: Unable to find an element with the text: Report post. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

    Ignored nodes: comments, script, style
    [36m<body>[39m
      [36m<div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"rounded-lg border bg-card text-card-foreground shadow-sm w-full"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"flex flex-col space-y-1.5 p-6 pb-3"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"flex items-start justify-between"[39m
            [36m>[39m
              [36m<a[39m
                [33mclass[39m=[32m"hover:opacity-80 transition-opacity"[39m
                [33mhref[39m=[32m"/profile/postauthor"[39m
              [36m>[39m
                [36m<div[39m
                  [33mclass[39m=[32m"flex items-center gap-2"[39m
                [36m>[39m
                  [36m<span[39m
                    [33mclass[39m=[32m"relative flex shrink-0 overflow-hidden rounded-full h-8 w-8"[39m
                  [36m>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"flex h-full w-full items-center justify-center rounded-full bg-muted text-sm"[39m
                    [36m>[39m
                      [0mPA[0m
                    [36m</span>[39m
                  [36m</span>[39m
                  [36m<div[39m
                    [33mclass[39m=[32m"flex flex-col min-w-0"[39m
                  [36m>[39m
                    [36m<div[39m
                      [33mclass[39m=[32m"flex items-center gap-2"[39m
                    [36m>[39m
                      [36m<span[39m
                        [33mclass[39m=[32m"font-medium truncate text-base"[39m
                      [36m>[39m
                        [0mPost Author[0m
                      [36m</span>[39m
                    [36m</div>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-muted-foreground truncate text-sm"[39m
                    [36m>[39m
                      [0m@[0m
                      [0mpostauthor[0m
                    [36m</span>[39m
                  [36m</div>[39m
                [36m</div>[39m
              [36m</a>[39m
              [36m<div[39m
                [33mclass[39m=[32m"flex items-center gap-2"[39m
              [36m>[39m
                [36m<span[39m
                  [33mclass[39m=[32m"text-sm text-muted-foreground"[39m
                [36m>[39m
                  [0mJanuary 1, 2024[0m
                [36m</span>[39m
                [36m<button[39m
                  [33maria-expanded[39m=[32m"false"[39m
                  [33maria-haspopup[39m=[32m"menu"[39m
                  [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0"[39m
                  [33mdata-state[39m=[32m"closed"[39m
                  [33mid[39m=[32m"radix-:rk:"[39m
                  [33mtype[39m=[32m"button"[39m
                [36m>[39m
                  [36m<svg[39m
                    [33mclass[39m=[32m"lucide lucide-ellipsis h-4 w-4"[39m
                    [33mfill[39m=[32m"none"[39m
                    [33mheight[39m=[32m"24"[39m
                    [33mstroke[39m=[32m"currentColor"[39m
                    [33mstroke-linecap[39m=[32m"round"[39m
                    [33mstroke-linejoin[39m=[32m"round"[39m
                    [33mstroke-width[39m=[32m"2"[39m
                    [33mviewBox[39m=[32m"0 0 24 24"[39m
                    [33mwidth[39m=[32m"24"[39m
                    [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                  [36m>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"12"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"19"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                    [36m<circle[39m
                      [33mcx[39m=[32m"5"[39m
                      [33mcy[39m=[32m"12"[39m
                      [33mr[39m=[32m"1"[39m
                    [36m/>[39m
                  [36m</svg>[39m
                [36m</button>[39m
              [36m</div>[39m
            [36m</div>[39m
          [36m</div>[39m
          [36m<div[39m
            [33mclass[39m=[32m"p-6 pt-0"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"space-y-3"[39m
            [36m>[39m
              [36m<div[39m
                [33mclass[39m=[32m"text-sm leading-relaxed whitespace-pre-wrap"[39m
              [36m>[39m
                [0mThis is a test post content[0m
              [36m</div>[39m
              [36m<div[39m
                [33mclass[39m=[32m"flex items-center justify-between pt-2 border-t"[39m
              [36m>[39m
                [36m<div[39m
                  [33mclass[39m=[32m"flex items-center gap-4"[39m
                [36m>[39m
                  [36m<button[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-red-500"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-heart h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0m5[0m
                    [36m</span>[39m
                  [36m</button>[39m
                  [36m<a[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-blue-500"[39m
                    [33mhref[39m=[32m"/post/post-1"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-message-circle h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M7.9 20A9 9 0 1 0 4 16.1L2 22Z"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0m3[0m
                    [36m</span>[39m
                  [36m</a>[39m
                  [36m<button[39m
                    [33mclass[39m=[32m"justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 flex items-center gap-2 text-muted-foreground hover:text-green-500"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-share h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"[39m
                      [36m/>[39m
                      [36m<polyline[39m
                        [33mpoints[39m=[32m"16 6 12 2 8 6"[39m
                      [36m/>[39m
                      [36m<line[39m
                        [33mx1[39m=[32m"12"[39m
                        [33mx2[39m=[32m"12"[39m
                        [33my1[39m=[32m"2"[39m
                        [33my2[39m=[32m"15"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [36m<span[39m
                      [33mclass[39m=[32m"text-sm"[39m
                    [36m>[39m
                      [0mShare[0m
                    [36m</span>[39m
                  [36m</button>[39m
                [36m</div>[39m
                [36m<button[39m
                  [33mclass[39m=[32m"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 text-muted-foreground hover:text-yellow-500"[39m
                [36m>[39m
                  [36m<svg[39m
                    [33mclass[39m=[32m"lucide lucide-bookmark h-4 w-4"[39m
                    [33mfill[39m=[32m"none"[39m
                    [33mheight[39m=[32m"24"[39m
                    [33mstroke[39m=[32m"currentColor"[39m
                    [33mstroke-linecap[39m=[32m"round"[39m
                    [33mstroke-linejoin[39m=[32m"round"[39m
                    [33mstroke-width[39m=[32m"2"[39m
                    [33mviewBox[39m=[32m"0 0 24 24"[39m
                    [33mwidth[39m=[32m"24"[39m
                    [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                  [36m>[39m
                    [36m<path[39m
                      [33md[39m=[32m"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"[39m
                    [36m/>[39m
                  [36m</svg>[39m
                [36m</button>[39m
              [36m</div>[39m
            [36m</div>[39m
          [36m</div>[39m
        [36m</div>[39m
      [36m</div>[39m
    [36m</body>[39m

    [0m [90m 117 |[39m     fireEvent[33m.[39mclick(dropdownTrigger)
     [90m 118 |[39m
    [31m[1m>[22m[39m[90m 119 |[39m     expect(screen[33m.[39mgetByText([32m'Report post'[39m))[33m.[39mtoBeInTheDocument()
     [90m     |[39m                   [31m[1m^[22m[39m
     [90m 120 |[39m   })
     [90m 121 |[39m
     [90m 122 |[39m   it([32m'should update like count when liked'[39m[33m,[39m () [33m=>[39m {[0m

      at Object.getElementError (node_modules/@testing-library/dom/dist/config.js:37:19)
      at node_modules/@testing-library/dom/dist/query-helpers.js:76:38
      at node_modules/@testing-library/dom/dist/query-helpers.js:52:17
      at node_modules/@testing-library/dom/dist/query-helpers.js:95:19
      at Object.getByText (src/__tests__/components/post-item.test.tsx:119:19)

  ● PostItem › should apply custom className

    expect(element).toHaveClass("custom-class")

    Expected the element to have class:
      custom-class
    Received:
      flex flex-col space-y-1.5 p-6 pb-3

    [0m [90m 133 |[39m     [36mconst[39m { container } [33m=[39m render([33m<[39m[33mPostItem[39m post[33m=[39m{mockPost} className[33m=[39m[32m"custom-class"[39m [33m/[39m[33m>[39m)
     [90m 134 |[39m     
    [31m[1m>[22m[39m[90m 135 |[39m     expect(container[33m.[39mfirstChild[33m?[39m[33m.[39mfirstChild)[33m.[39mtoHaveClass([32m'custom-class'[39m)
     [90m     |[39m                                              [31m[1m^[22m[39m
     [90m 136 |[39m   })
     [90m 137 |[39m })[0m

      at Object.toHaveClass (src/__tests__/components/post-item.test.tsx:135:46)

FAIL src/__tests__/api/comments.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/api/comments.test.ts'

    [0m [90m  8 |[39m [90m// Mock dependencies[39m
     [90m  9 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m 10 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m 11 |[39m   prisma[33m:[39m {
     [90m 12 |[39m     post[33m:[39m {
     [90m 13 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/api/comments.test.ts:10:6)

FAIL src/__tests__/api/follow.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/api/follow.test.ts'

    [0m [90m  9 |[39m [90m// Mock dependencies[39m
     [90m 10 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m 11 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m 12 |[39m   prisma[33m:[39m {
     [90m 13 |[39m     user[33m:[39m {
     [90m 14 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/api/follow.test.ts:11:6)

FAIL src/__tests__/api/likes.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/prisma' from 'src/__tests__/api/likes.test.ts'

    [0m [90m  7 |[39m [90m// Mock dependencies[39m
     [90m  8 |[39m jest[33m.[39mmock([32m'next-auth'[39m)
    [31m[1m>[22m[39m[90m  9 |[39m jest[33m.[39mmock([32m'@/lib/prisma'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m 10 |[39m   prisma[33m:[39m {
     [90m 11 |[39m     post[33m:[39m {
     [90m 12 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/api/likes.test.ts:9:6)

FAIL src/__tests__/api/auth-register.test.ts
  ● Test suite failed to run

    Cannot find module '@/lib/db' from 'src/__tests__/api/auth-register.test.ts'

    [0m [90m  5 |[39m
     [90m  6 |[39m [90m// Mock dependencies[39m
    [31m[1m>[22m[39m[90m  7 |[39m jest[33m.[39mmock([32m'@/lib/db'[39m[33m,[39m () [33m=>[39m ({
     [90m    |[39m      [31m[1m^[22m[39m
     [90m  8 |[39m   prisma[33m:[39m {
     [90m  9 |[39m     user[33m:[39m {
     [90m 10 |[39m       findUnique[33m:[39m jest[33m.[39mfn()[33m,[39m[0m

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.mock (src/__tests__/api/auth-register.test.ts:7:6)

FAIL src/__tests__/hooks/use-notifications.test.ts (11.826 s)
  ● useNotifications › should mark notification as read

    TypeError: result.current.markAsRead is not a function

    Ignored nodes: comments, script, style
    [36m<html>[39m
      [36m<head />[39m
      [36m<body>[39m
        [36m<div />[39m
      [36m</body>[39m
    [36m</html>[39m

    [0m [90m 125 |[39m
     [90m 126 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
    [31m[1m>[22m[39m[90m 127 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mmarkAsRead([32m'notification-1'[39m)
     [90m     |[39m                            [31m[1m^[22m[39m
     [90m 128 |[39m     })
     [90m 129 |[39m
     [90m 130 |[39m     expect(global[33m.[39mfetch)[33m.[39mtoHaveBeenCalledWith([32m'/api/notifications/notification-1'[39m[33m,[39m {[0m

      at markAsRead (src/__tests__/hooks/use-notifications.test.ts:127:28)
      at runWithExpensiveErrorDiagnosticsDisabled (node_modules/@testing-library/dom/dist/config.js:47:12)
      at checkCallback (node_modules/@testing-library/dom/dist/wait-for.js:124:77)
      at checkRealTimersCallback (node_modules/@testing-library/dom/dist/wait-for.js:118:16)
      at Timeout.task [as _onTimeout] (node_modules/jsdom/lib/jsdom/browser/Window.js:520:19)

  ● useNotifications › should mark all notifications as read

    TypeError: result.current.markAllAsRead is not a function

    Ignored nodes: comments, script, style
    [36m<html>[39m
      [36m<head />[39m
      [36m<body>[39m
        [36m<div />[39m
      [36m</body>[39m
    [36m</html>[39m

    [0m [90m 154 |[39m
     [90m 155 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
    [31m[1m>[22m[39m[90m 156 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mmarkAllAsRead()
     [90m     |[39m                            [31m[1m^[22m[39m
     [90m 157 |[39m     })
     [90m 158 |[39m
     [90m 159 |[39m     expect(global[33m.[39mfetch)[33m.[39mtoHaveBeenCalledWith([32m'/api/notifications'[39m[33m,[39m {[0m

      at markAllAsRead (src/__tests__/hooks/use-notifications.test.ts:156:28)
      at runWithExpensiveErrorDiagnosticsDisabled (node_modules/@testing-library/dom/dist/config.js:47:12)
      at checkCallback (node_modules/@testing-library/dom/dist/wait-for.js:124:77)
      at checkRealTimersCallback (node_modules/@testing-library/dom/dist/wait-for.js:118:16)
      at Timeout.task [as _onTimeout] (node_modules/jsdom/lib/jsdom/browser/Window.js:520:19)

  ● useNotifications › should handle mark as read error

    TypeError: result.current.markAsRead is not a function

    [0m [90m 179 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useNotifications())
     [90m 180 |[39m
    [31m[1m>[22m[39m[90m 181 |[39m     [36mawait[39m expect(result[33m.[39mcurrent[33m.[39mmarkAsRead([32m'notification-1'[39m))[33m.[39mrejects[33m.[39mtoThrow([32m'Network error'[39m)
     [90m     |[39m                                 [31m[1m^[22m[39m
     [90m 182 |[39m   })
     [90m 183 |[39m
     [90m 184 |[39m   it([32m'should delete notification'[39m[33m,[39m [36masync[39m () [33m=>[39m {[0m

      at Object.markAsRead (src/__tests__/hooks/use-notifications.test.ts:181:33)

  ● useNotifications › should delete notification

    TypeError: result.current.deleteNotification is not a function

    Ignored nodes: comments, script, style
    [36m<html>[39m
      [36m<head />[39m
      [36m<body>[39m
        [36m<div />[39m
      [36m</body>[39m
    [36m</html>[39m

    [0m [90m 199 |[39m
     [90m 200 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
    [31m[1m>[22m[39m[90m 201 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mdeleteNotification([32m'notification-1'[39m)
     [90m     |[39m                            [31m[1m^[22m[39m
     [90m 202 |[39m     })
     [90m 203 |[39m
     [90m 204 |[39m     expect(global[33m.[39mfetch)[33m.[39mtoHaveBeenCalledWith([32m'/api/notifications/notification-1'[39m[33m,[39m {[0m

      at deleteNotification (src/__tests__/hooks/use-notifications.test.ts:201:28)
      at runWithExpensiveErrorDiagnosticsDisabled (node_modules/@testing-library/dom/dist/config.js:47:12)
      at checkCallback (node_modules/@testing-library/dom/dist/wait-for.js:124:77)
      at checkRealTimersCallback (node_modules/@testing-library/dom/dist/wait-for.js:118:16)
      at Timeout.task [as _onTimeout] (node_modules/jsdom/lib/jsdom/browser/Window.js:520:19)

  ● useNotifications › should handle pagination

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: undefined

    [0m [90m 219 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useNotifications())
     [90m 220 |[39m
    [31m[1m>[22m[39m[90m 221 |[39m     expect(result[33m.[39mcurrent[33m.[39mhasMore)[33m.[39mtoBe([36mtrue[39m)
     [90m     |[39m                                    [31m[1m^[22m[39m
     [90m 222 |[39m     expect(result[33m.[39mcurrent[33m.[39mpagination)[33m.[39mtoEqual({
     [90m 223 |[39m       page[33m:[39m [35m1[39m[33m,[39m
     [90m 224 |[39m       limit[33m:[39m [35m10[39m[33m,[39m[0m

      at Object.toBe (src/__tests__/hooks/use-notifications.test.ts:221:36)

  ● useNotifications › should load more notifications

    TypeError: result.current.loadMore is not a function

    Ignored nodes: comments, script, style
    [36m<html>[39m
      [36m<head />[39m
      [36m<body>[39m
        [36m<div />[39m
      [36m</body>[39m
    [36m</html>[39m

    [0m [90m 251 |[39m
     [90m 252 |[39m     [36mawait[39m waitFor([36masync[39m () [33m=>[39m {
    [31m[1m>[22m[39m[90m 253 |[39m       [36mawait[39m result[33m.[39mcurrent[33m.[39mloadMore()
     [90m     |[39m                            [31m[1m^[22m[39m
     [90m 254 |[39m     })
     [90m 255 |[39m
     [90m 256 |[39m     expect(global[33m.[39mfetch)[33m.[39mtoHaveBeenCalledWith([32m'/api/notifications?page=2&limit=10'[39m)[0m

      at loadMore (src/__tests__/hooks/use-notifications.test.ts:253:28)
      at runWithExpensiveErrorDiagnosticsDisabled (node_modules/@testing-library/dom/dist/config.js:47:12)
      at checkCallback (node_modules/@testing-library/dom/dist/wait-for.js:124:77)
      at checkRealTimersCallback (node_modules/@testing-library/dom/dist/wait-for.js:118:16)
      at Timeout.task [as _onTimeout] (node_modules/jsdom/lib/jsdom/browser/Window.js:520:19)

  ● useNotifications › should refresh notifications

    TypeError: result.current.refresh is not a function

    [0m [90m 269 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useNotifications())
     [90m 270 |[39m
    [31m[1m>[22m[39m[90m 271 |[39m     [36mawait[39m result[33m.[39mcurrent[33m.[39mrefresh()
     [90m     |[39m                          [31m[1m^[22m[39m
     [90m 272 |[39m
     [90m 273 |[39m     expect(mockMutate)[33m.[39mtoHaveBeenCalled()
     [90m 274 |[39m   })[0m

      at Object.refresh (src/__tests__/hooks/use-notifications.test.ts:271:26)

  ● useNotifications › should get unread notifications only

    TypeError: result.current.getUnreadNotifications is not a function

    [0m [90m 284 |[39m     [36mconst[39m { result } [33m=[39m renderHook(() [33m=>[39m useNotifications())
     [90m 285 |[39m
    [31m[1m>[22m[39m[90m 286 |[39m     [36mconst[39m unreadNotifications [33m=[39m result[33m.[39mcurrent[33m.[39mgetUnreadNotifications()
     [90m     |[39m                                                [31m[1m^[22m[39m
     [90m 287 |[39m     expect(unreadNotifications)[33m.[39mtoHaveLength([35m1[39m)
     [90m 288 |[39m     expect(unreadNotifications[[35m0[39m][33m.[39mid)[33m.[39mtoBe([32m'notification-1'[39m)
     [90m 289 |[39m   })[0m

      at Object.getUnreadNotifications (src/__tests__/hooks/use-notifications.test.ts:286:48)


Test Suites: 27 failed, 1 passed, 28 total
Tests:       27 failed, 27 passed, 54 total
Snapshots:   0 total
Time:        30.437 s
Ran all test suites.

```

## Production Build

❌ **Status:** FAILED

### Build Errors
```
 ⚠ Invalid next.config.js options detected: 
 ⚠     Unrecognized key(s) in object: 'appDir' at "experimental"
 ⚠ See more info here: https://nextjs.org/docs/messages/invalid-next-config
Failed to compile.

./src/components/feed/enhanced-interactive-feed.tsx
Error: 
  [31mx[0m Expected ',', got 'const'
    ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\feed\enhanced-interactive-feed.tsx[0m:58:1]
 [2m58[0m |   }
 [2m59[0m |   
 [2m60[0m |   // Handle sort changes
 [2m61[0m |   const handleSortChange = (sort: 'recent' | 'popular') => {
    : [31;1m  ^^^^^[0m
 [2m62[0m |     setSortBy(sort)
 [2m63[0m |   }
 [2m63[0m |   
    `----

Caused by:
    Syntax Error

Import trace for requested module:
./src/components/feed/enhanced-interactive-feed.tsx
./src/components/feed/real-time-feed.tsx

./src/components/profile/followers-list.tsx
Error: 
  [31mx[0m Unexpected token `EmptyState`. Expected jsx identifier
     ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\profile\followers-list.tsx[0m:151:1]
 [2m151[0m | 
 [2m152[0m |   if (!session) {
 [2m153[0m |     return (
 [2m154[0m |       <EmptyState
     : [31;1m       ^^^^^^^^^^[0m
 [2m155[0m |         icon={Users}
 [2m156[0m |         title=\"Authentication Required\"
 [2m156[0m |         description=\"Please sign in to view followers\"
     `----

Caused by:
    Syntax Error

Import trace for requested module:
./src/components/profile/followers-list.tsx
./src/components/profile/profile-tabs.tsx

./src/components/profile/following-list.tsx
Error: 
  [31mx[0m Unexpected token `EmptyState`. Expected jsx identifier
     ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\profile\following-list.tsx[0m:151:1]
 [2m151[0m | 
 [2m152[0m |   if (!session) {
 [2m153[0m |     return (
 [2m154[0m |       <EmptyState
     : [31;1m       ^^^^^^^^^^[0m
 [2m155[0m |         icon={UserCheck}
 [2m156[0m |         title=\"Authentication Required\"
 [2m156[0m |         description=\"Please sign in to view following\"
     `----

Caused by:
    Syntax Error

Import trace for requested module:
./src/components/profile/following-list.tsx
./src/components/profile/profile-tabs.tsx

./src/components/rankings/ranking-board.tsx
Error: 
  [31mx[0m the name `getRankingInfo` is defined multiple times
     ,-[[36;1;4mC:\Users\Sai\Desktop\Code_\kiro_test_2\src\components\rankings\ranking-board.tsx[0m:2:1]
 [2m  2[0m | 
 [2m  3[0m | import { useState } from 'react'
 [2m  4[0m | import { Ranking, RankingType } from '@/types'
 [2m  5[0m | import { getRankingInfo, getRankingColorClass, getRankBadgeColor, getRankEmoji } from '@/lib/ranking'
     : [31;1m         ^^^^^^^|^^^^^^[0m
     :                 [31;1m`-- [31;1mprevious definition of `getRankingInfo` here[0m[0m
 [2m  6[0m | import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
 [2m  7[0m | import { Badge } from '@/components/ui/badge'
 [2m  8[0m | import { Button } from '@/components/ui/button'
 [2m  9[0m | import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
 [2m 10[0m | import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
 [2m 11[0m | import { UserBadge } from '@/components/ui/user-badge'
 [2m 12[0m | import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
 [2m 13[0m | import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
 [2m 14[0m | import { cn } from '@/lib/utils'
 [2m 15[0m | 
 [2m 16[0m | interface RankingBoardProps {
 [2m 17[0m |   rankings: Record<string, Record<string, Ranking[]>>
 [2m 18[0m |   isLoading?: boolean
 [2m 19[0m | }
 [2m 20[0m | 
 [2m 21[0m | export function RankingBoard({ rankings, isLoading }: RankingBoardProps) {
 [2m 22[0m |   const [selectedType, setSelectedType] = useState<RankingType>('ENGAGEMENT')
 [2m 23[0m |   const [selectedPeriod, setSelectedPeriod] = useState<string>('all-time')
 [2m 24[0m | 
 [2m 25[0m |   if (isLoading) {
 [2m 26[0m |     return (
 [2m 27[0m |       <div className="space-y-4">
 [2m 28[0m |         {Array.from({ length: 5 }).map((_, i) => (
 [2m 29[0m |           <div key={i} className="h-16 bg-muted rounded animate-pulse" />
 [2m 30[0m |         ))}
 [2m 31[0m |       </div>
 [2m 32[0m |     )
 [2m 33[0m |   }
 [2m 34[0m | 
 [2m 35[0m |   const currentRankings = rankings[selectedType]?.[selectedPeriod] || []
 [2m 36[0m |   const availablePeriods = rankings[selectedType] ? Object.keys(rankings[selectedType]) : ['all-time']
 [2m 37[0m | 
 [2m 38[0m |   return (
 [2m 39[0m |     <div className="space-y-6">
 [2m 40[0m |       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
 [2m 41[0m |         <div>
 [2m 42[0m |           <h2 className="text-2xl font-bold">Community Rankings</h2>
 [2m 43[0m |           <p className="text-muted-foreground">
 [2m 44[0m |             See who's leading the community in various categories
 [2m 45[0m |           </p>
 [2m 46[0m |         </div>
 [2m 47[0m |         
 [2m 48[0m |         <div className="flex gap-2">
 [2m 49[0m |           <Select value={selectedType} onValueChange={(value) => setSelectedType(value as RankingType)}>
 [2m 50[0m |             <SelectTrigger className="w-48">
 [2m 51[0m |               <SelectValue />
 [2m 52[0m |             </SelectTrigger>
 [2m 53[0m |             <SelectContent>
 [2m 54[0m |               {Object.entries(getRankingInfo).map(([type, info]) => (
 [2m 55[0m |                 <SelectItem key={type} value={type}>
 [2m 56[0m |                   <div className="flex items-center gap-2">
 [2m 57[0m |                     <span>{info.icon}</span>
 [2m 58[0m |                     <span>{info.name}</span>
 [2m 59[0m |                   </div>
 [2m 60[0m |                 </SelectItem>
 [2m 61[0m |               ))}
 [2m 62[0m |             </SelectContent>
 [2m 63[0m |           </Select>
 [2m 64[0m |           
 [2m 65[0m |           <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
 [2m 66[0m |             <SelectTrigger className="w-32">
 [2m 67[0m |               <SelectValue />
 [2m 68[0m |             </SelectTrigger>
 [2m 69[0m |             <SelectContent>
 [2m 70[0m |               {availablePeriods.map((period) => (
 [2m 71[0m |                 <SelectItem key={period} value={period}>
 [2m 72[0m |                   {formatPeriod(period)}
 [2m 73[0m |                 </SelectItem>
 [2m 74[0m |               ))}
 [2m 75[0m |             </SelectContent>
 [2m 76[0m |           </Select>
 [2m 77[0m |         </div>
 [2m 78[0m |       </div>
 [2m 79[0m | 
 [2m 80[0m |       <Card>
 [2m 81[0m |         <CardHeader>
 [2m 82[0m |           <div className="flex items-center gap-3">
 [2m 83[0m |             <span className="text-2xl">{getRankingInfo(selectedType).icon}</span>
 [2m 84[0m |             <div>
 [2m 85[0m |               <CardTitle className="flex items-center gap-2">
 [2m 86[0m |                 {getRankingInfo(selectedType).name}
 [2m 87[0m |                 <Badge className={getRankingColorClass(selectedType)}>
 [2m 88[0m |                   {formatPeriod(selectedPeriod)}
 [2m 89[0m |                 </Badge>
 [2m 90[0m |               </CardTitle>
 [2m 91[0m |               <CardDescription>
 [2m 92[0m |                 {getRankingInfo(selectedType).description}
 [2m 93[0m |               </CardDescription>
 [2m 94[0m |             </div>
 [2m 95[0m |           </div>
 [2m 96[0m |         </CardHeader>
 [2m 97[0m |         <CardContent>
 [2m 98[0m |           {currentRankings.length === 0 ? (
 [2m 99[0m |             <div className="text-center py-8">
 [2m100[0m |               <div className="text-4xl mb-2">📊</div>
 [2m101[0m |               <h3 className="font-semibold mb-1">No Rankings Yet</h3>
 [2m102[0m |               <p className="text-sm text-muted-foreground">
 [2m103[0m |                 Rankings will appear here once users start engaging with the community
 [2m104[0m |               </p>
 [2m105[0m |             </div>
 [2m106[0m |           ) : (
 [2m107[0m |             <div className="space-y-3">
 [2m108[0m |               {currentRankings.slice(0, 3).map((ranking) => (
 [2m109[0m |                 <TopRankingCard key={ranking.id} ranking={ranking} />
 [2m110[0m |               ))}
 [2m111[0m |               
 [2m112[0m |               {currentRankings.length > 3 && (
 [2m113[0m |                 <div className="space-y-2 pt-4 border-t">
 [2m114[0m |                   {currentRankings.slice(3, 10).map((ranking) => (
 [2m115[0m |                     <RankingRow key={ranking.id} ranking={ranking} />
 [2m116[0m |                   ))}
 [2m117[0m |                 </div>
 [2m118[0m |               )}
 [2m119[0m |               
 [2m120[0m |               {currentRankings.length > 10 && (
 [2m121[0m |                 <div className="text-center pt-4">
 [2m122[0m |                   <Button variant="outline" size="sm">
 [2m123[0m |                     View All Rankings
 [2m124[0m |                   </Button>
 [2m125[0m |                 </div>
 [2m126[0m |               )}
 [2m127[0m |             </div>
 [2m128[0m |           )}
 [2m129[0m |         </CardContent>
 [2m130[0m |       </Card>
 [2m131[0m |     </div>
 [2m132[0m |   )
 [2m133[0m | }
 [2m134[0m | 
 [2m135[0m | function TopRankingCard({ ranking }: { ranking: Ranking }) {
 [2m136[0m |   const rankColor = getRankBadgeColor(ranking.rank || 0)
 [2m137[0m |   const emoji = getRankEmoji(ranking.rank || 0)
 [2m138[0m | 
 [2m139[0m |   return (
 [2m140[0m |     <Card className={cn(
 [2m141[0m |       'relative overflow-hidden',
 [2m142[0m |       ranking.rank === 1 && 'ring-2 ring-yellow-200 bg-yellow-50/50',
 [2m143[0m |       ranking.rank === 2 && 'ring-2 ring-gray-200 bg-gray-50/50',
 [2m144[0m |       ranking.rank === 3 && 'ring-2 ring-orange-200 bg-orange-50/50'
 [2m145[0m |     )}>
 [2m146[0m |       <CardContent className="p-4">
 [2m147[0m |         <div className="flex items-center justify-between">
 [2m148[0m |           <div className="flex items-center gap-4">
 [2m149[0m |             <div className="relative">
 [2m150[0m |               <Avatar className="h-12 w-12">
 [2m151[0m |                 <AvatarImage src={ranking.user?.image || undefined} />
 [2m152[0m |                 <AvatarFallback>
 [2m153[0m |                   {ranking.user?.name?.[0] || ranking.user?.username?.[0] || '?'}
 [2m154[0m |                 </AvatarFallback>
 [2m155[0m |               </Avatar>
 [2m156[0m |               <div className="absolute -top-1 -right-1">
 [2m157[0m |                 <Badge className={cn('text-xs px-1.5 py-0.5', rankColor)}>
 [2m158[0m |                   {emoji}
 [2m159[0m |                 </Badge>
 [2m160[0m |               </div>
 [2m161[0m |             </div>
 [2m162[0m |             
 [2m163[0m |             <div className="flex-1 min-w-0">
 [2m164[0m |               <div className="flex items-center gap-2 mb-1">
 [2m165[0m |                 <h3 className="font-semibold truncate">
 [2m166[0m |                   {ranking.user?.name || ranking.user?.username}
 [2m167[0m |                 </h3>
 [2m168[0m |                 {ranking.user?.mbti && (
 [2m169[0m |                   <Badge variant="secondary" className="text-xs">
 [2m170[0m |                     {ranking.user.mbti.type}
 [2m171[0m |                   </Badge>
 [2m172[0m |                 )}
 [2m173[0m |               </div>
 [2m174[0m |               <p className="text-sm text-muted-foreground">
 [2m175[0m |                 @{ranking.user?.username}
 [2m176[0m |               </p>
 [2m177[0m |             </div>
 [2m178[0m |           </div>
 [2m179[0m |           
 [2m180[0m |           <div className="text-right">
 [2m181[0m |             <div className="text-2xl font-bold">
 [2m182[0m |               {ranking.score.toLocaleString()}
 [2m183[0m |             </div>
 [2m184[0m |             <div className="text-xs text-muted-foreground">
 [2m185[0m |               points
 [2m186[0m |             </div>
 [2m187[0m |           </div>
 [2m188[0m |         </div>
 [2m189[0m |       </CardContent>
 [2m190[0m |     </Card>
 [2m191[0m |   )
 [2m192[0m | }
 [2m193[0m | 
 [2m194[0m | function RankingRow({ ranking }: { ranking: Ranking }) {
 [2m195[0m |   const rankColor = getRankBadgeColor(ranking.rank || 0)
 [2m196[0m |   const emoji = getRankEmoji(ranking.rank || 0)
 [2m197[0m | 
 [2m198[0m |   return (
 [2m199[0m |     <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
 [2m200[0m |       <div className="flex items-center gap-3">
 [2m201[0m |         <Badge className={cn('text-xs px-2 py-1', rankColor)}>
 [2m202[0m |           {emoji} #{ranking.rank}
 [2m203[0m |         </Badge>
 [2m204[0m |         
 [2m205[0m |         <Avatar className="h-8 w-8">
 [2m206[0m |           <AvatarImage src={ranking.user?.image || undefined} />
 [2m207[0m |           <AvatarFallback className="text-xs">
 [2m208[0m |             {ranking.user?.name?.[0] || ranking.user?.username?.[0] || '?'}
 [2m209[0m |           </AvatarFallback>
 [2m210[0m |         </Avatar>
 [2m211[0m |         
 [2m212[0m |         <div className="flex-1 min-w-0">
 [2m213[0m |           <div className="flex items-center gap-2">
 [2m214[0m |             <span className="font-medium truncate">
 [2m215[0m |               {ranking.user?.name || ranking.user?.username}
 [2m216[0m |             </span>
 [2m217[0m |             {ranking.user?.mbti && (
 [2m218[0m |               <Badge variant="secondary" className="text-xs">
 [2m219[0m |                 {ranking.user.mbti.type}
 [2m220[0m |               </Badge>
 [2m221[0m |             )}
 [2m222[0m |           </div>
 [2m223[0m |           <span className="text-xs text-muted-foreground">
 [2m224[0m |             @{ranking.user?.username}
 [2m225[0m |           </span>
 [2m226[0m |         </div>
 [2m227[0m |       </div>
 [2m228[0m |       
 [2m229[0m |       <div className="text-right">
 [2m230[0m |         <div className="font-semibold">
 [2m231[0m |           {ranking.score.toLocaleString()}
 [2m232[0m |         </div>
 [2m233[0m |         <div className="text-xs text-muted-foreground">
 [2m234[0m |           pts
 [2m235[0m |         </div>
 [2m236[0m |       </div>
 [2m237[0m |     </div>
 [2m238[0m |   )
 [2m239[0m | }
 [2m240[0m | 
 [2m241[0m | function formatPeriod(period: string): string {
 [2m242[0m |   if (period === 'all-time') return 'All Time'
 [2m243[0m |   if (period.includes('-W')) {
 [2m244[0m |     const [year, week] = period.split('-W')
 [2m245[0m |     return `Week ${week}, ${year}`
 [2m246[0m |   }
 [2m247[0m |   if (period.includes('-')) {
 [2m248[0m |     const [year, month] = period.split('-')
 [2m249[0m |     const monthNames = [
 [2m250[0m |       'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
 [2m251[0m |       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
 [2m252[0m |     ]
 [2m253[0m |     return `${monthNames[parseInt(month) - 1]} ${year}`
 [2m254[0m |   }
 [2m255[0m |   return period
 [2m256[0m | }
 [2m257[0m | 
 [2m258[0m | const getRankingInfo = (type: RankingType) => {
     : [33;1m      ^^^^^^^|^^^^^^[0m
     :              [33;1m`-- [33;1m`getRankingInfo` redefined here[0m[0m
 [2m259[0m |   const info = {
 [2m260[0m |     POSTS_LIKES: { name: 'Most Liked', description: 'Users with the most likes', icon: '❤️' },
 [2m260[0m |     POSTS_COUNT: { name: 'Most Active', description: 'Users with the most posts', icon: '📝' },
     `----

Import trace for requested module:
./src/components/rankings/ranking-board.tsx
./src/app/rankings/page.tsx

./src/components/ui/alert-dialog.tsx
Module not found: Can't resolve '@radix-ui/react-alert-dialog'

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./src/components/admin/content-moderation.tsx


> Build failed because of webpack errors

```

## Summary

- **Checks Passed:** 1/5
- **Overall Score:** 20/100

❌ **Not Ready!** Critical issues must be fixed before deployment.

## Recommendations

- Fix all requirement validation errors before proceeding
- Ensure all tests pass before deployment
- Fix build errors to enable production deployment
- Configure all required environment variables
- Review performance audit suggestions for optimization opportunities
- Ensure all security best practices are implemented
- Test the application thoroughly in a staging environment
