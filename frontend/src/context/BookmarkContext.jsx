import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [hackathonIds, setHackathonIds] = useState(new Set());
  const [internshipIds, setInternshipIds] = useState(new Set());
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync bookmark IDs whenever authentication changes
  const refreshBookmarkIds = useCallback(async () => {
    if (!isAuthenticated) {
      setHackathonIds(new Set());
      setInternshipIds(new Set());
      setBookmarks([]);
      return;
    }

    try {
      const { data } = await api.get('/bookmarks/ids');
      if (data.success && data.data) {
        setHackathonIds(new Set(data.data.hackathons || []));
        setInternshipIds(new Set(data.data.internships || []));
      }
    } catch (err) {
      console.error('Failed to sync bookmark IDs:', err.message);
    }
  }, [isAuthenticated]);

  // Fetch full populated bookmarks for dashboard and bookmarks page
  const fetchAllBookmarks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const { data } = await api.get('/bookmarks');
      if (data.success) {
        setBookmarks(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch user bookmarks:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshBookmarkIds();
    if (isAuthenticated) {
      fetchAllBookmarks();
    }
  }, [isAuthenticated, refreshBookmarkIds, fetchAllBookmarks]);

  const isBookmarked = (itemType, id) => {
    if (!id) return false;
    const strId = id.toString();
    return itemType === 'hackathon'
      ? hackathonIds.has(strId)
      : internshipIds.has(strId);
  };

  const toggleBookmark = async (itemType, item) => {
    if (!isAuthenticated) {
      return { success: false, requireAuth: true };
    }

    const itemId = item._id ? item._id.toString() : item.toString();
    const currentlySaved = isBookmarked(itemType, itemId);

    // Optimistic UI updates
    if (itemType === 'hackathon') {
      const updated = new Set(hackathonIds);
      if (currentlySaved) updated.delete(itemId);
      else updated.add(itemId);
      setHackathonIds(updated);
    } else {
      const updated = new Set(internshipIds);
      if (currentlySaved) updated.delete(itemId);
      else updated.add(itemId);
      setInternshipIds(updated);
    }

    try {
      const { data } = await api.post('/bookmarks/toggle', {
        itemType,
        itemId,
      });

      if (data.success) {
        // Re-fetch populated bookmarks in the background
        fetchAllBookmarks();
        return {
          success: true,
          bookmarked: data.bookmarked,
          message: data.message,
        };
      }
    } catch (error) {
      // Revert optimistic update on failure
      refreshBookmarkIds();
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update bookmark.',
      };
    }
  };

  const deleteBookmark = async (bookmarkId) => {
    try {
      const { data } = await api.delete(`/bookmarks/${bookmarkId}`);
      if (data.success) {
        setBookmarks((prev) => prev.filter((b) => b._id !== bookmarkId));
        refreshBookmarkIds();
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove bookmark.',
      };
    }
  };

  const value = {
    hackathonIds,
    internshipIds,
    bookmarks,
    loading,
    isBookmarked,
    toggleBookmark,
    deleteBookmark,
    refreshBookmarks: fetchAllBookmarks,
  };

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
