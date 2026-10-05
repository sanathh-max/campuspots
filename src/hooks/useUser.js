import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/db';

export function useUser() {
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const savedNickname = db.getUserNickname();
    const uid = db.getUserId();
    setNickname(savedNickname);
    setUserId(uid);

    if (!savedNickname) {
      setIsModalOpen(true);
      setIsFirstVisit(true);
    }
  }, []);

  const saveNickname = useCallback((newNickname) => {
    const saved = db.setUserNickname(newNickname);
    setNickname(saved);
    setIsModalOpen(false);
    setIsFirstVisit(false);
    return saved;
  }, []);

  const promptNicknameChange = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  return {
    nickname,
    userId,
    isModalOpen,
    isFirstVisit,
    saveNickname,
    promptNicknameChange,
    closeModal: () => setIsModalOpen(false)
  };
}
