import React from 'react';
import { ShoppingBag, Coins, Check, X } from 'lucide-react';
import { ChildProfile } from '../../types';
import { SHOP_HATS } from '../../data/avatars';
import { sound } from '../../utils/sound';

interface AvatarShopModalProps {
  isOpen: boolean;
  profile: ChildProfile;
  onClose: () => void;
  onUpdateProfile: (updated: ChildProfile) => void;
}

export const AvatarShopModal: React.FC<AvatarShopModalProps> = ({
  isOpen,
  profile,
  onClose,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const handleBuyOrEquip = (itemId: string, price: number) => {
    const isUnlocked = profile.unlockedItems.includes(itemId);

    if (isUnlocked) {
      sound.playClick();
      // Equip item
      onUpdateProfile({
        ...profile,
        avatar: {
          ...profile.avatar,
          hatId: itemId,
        },
      });
    } else {
      // Buy item
      if (profile.coins >= price) {
        sound.playFanfare();
        onUpdateProfile({
          ...profile,
          coins: profile.coins - price,
          unlockedItems: [...profile.unlockedItems, itemId],
          avatar: {
            ...profile.avatar,
            hatId: itemId,
          },
        });
      } else {
        sound.playWrong();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-4 border-yellow-400 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-black text-xl p-2 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 text-yellow-800 rounded-2xl border border-yellow-300">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900">Mascot Wardrobe Store</h3>
              <p className="text-xs text-gray-500 font-bold">Use earned coins to buy cool accessories!</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-yellow-100 border border-yellow-300 text-yellow-900 px-3 py-1.5 rounded-2xl font-black text-sm">
            <span>💰</span>
            <span>{profile.coins} Coins</span>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {SHOP_HATS.map((item) => {
            const isUnlocked = profile.unlockedItems.includes(item.id);
            const isEquipped = profile.avatar.hatId === item.id;
            const canAfford = profile.coins >= item.price;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border-3 text-center transition-all ${
                  isEquipped
                    ? 'bg-amber-100 border-amber-500 shadow-md scale-102'
                    : isUnlocked
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="text-4xl mb-1">{item.icon}</div>
                <h4 className="font-black text-gray-900 text-xs mb-1 truncate">{item.name}</h4>

                {isEquipped ? (
                  <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full block">
                    Equipped ✅
                  </span>
                ) : isUnlocked ? (
                  <button
                    onClick={() => handleBuyOrEquip(item.id, item.price)}
                    className="w-full py-1 bg-emerald-500 hover:bg-emerald-400 text-white text-[10px] font-black rounded-lg cursor-pointer"
                  >
                    Equip
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuyOrEquip(item.id, item.price)}
                    disabled={!canAfford}
                    className={`w-full py-1 text-[10px] font-black rounded-lg cursor-pointer transition-all ${
                      canAfford
                        ? 'bg-yellow-400 hover:bg-yellow-300 text-yellow-950 shadow-xs'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Buy 💰 {item.price}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
