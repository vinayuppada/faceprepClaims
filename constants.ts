
import React from 'react';
import { ClaimCategory } from './types';
import FoodIcon from './components/icons/FoodIcon';
import CabIcon from './components/icons/CabIcon';
import TrainIcon from './components/icons/TrainIcon';
import LaundryIcon from './components/icons/LaundryIcon';
import StayIcon from './components/icons/StayIcon';

export const CATEGORIES: { value: ClaimCategory; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { value: ClaimCategory.Food, label: "Food", icon: FoodIcon },
    { value: ClaimCategory.Cab, label: "Cab / Taxi", icon: CabIcon },
    { value: ClaimCategory.Train, label: "Train / Public Transport", icon: TrainIcon },
    { value: ClaimCategory.Laundry, label: "Laundry", icon: LaundryIcon },
    { value: ClaimCategory.Stay, label: "Hotel / Stay", icon: StayIcon },
];
