import React, { useEffect, useState } from 'react';
import axios from 'axios';
import base_url from './base_url';

interface Rule {
    id: number;
    type: string;
    shipping_method: string;
    foods: number;
    clothes: number;
    shoes_and_bags: number;
    cosmetics: number;
    medicines: number;
    supplements: number;
    valuable_items: number;
}

interface AddonChoice {
    id: number;
    name: string;
    fee: number;
}

interface Addon {
    id: number;
    type: string;
    name: string;
    choices: AddonChoice[];
}

const Rules: React.FC = () => {
    const [rules, setRules] = useState<Rule[]>([]);
    const [addons, setAddons] = useState<Addon[]>([]);

    useEffect(() => {
        axios.get(`${base_url()}/api/rules/`)
            .then(response => setRules(response.data))
            .catch(error => console.error(error));

        axios.get(`${base_url()}/api/addons/`)
            .then(response => setAddons(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="p-8 bg-amber-50 rounded-xl shadow-md my-8">

            <h1 className='mb-8 text-xl font-bold text-amber-600'>Logistics Fees</h1>

            <div className="grid grid-cols-2 gap-4 my-4">
                <div>
                    <p className="text-lg bg-white px-8 py-2 rounded-xl mb-4 text-amber-600 font-bold">MM to SG</p>
                    {rules.map(rule => rule.type == 'mm to sg' && (
                        <div className="grid grid-cols-1 gap-4 rounded-xl bg-white p-8" key={rule.id}>
                            <p className="text-lg text-amber-600 font-bold">{rule.shipping_method.toUpperCase()}</p>
                            <p>Foods: {rule.foods} SGD</p>
                            <p>Clothes: {rule.clothes} SGD</p>
                            <p>Shoes and Bags: {rule.shoes_and_bags} SGD</p>
                            <p>Cosmetics: {rule.cosmetics} SGD</p>
                            <p>Medicines: {rule.medicines} SGD</p>
                            <p>Supplements: {rule.supplements} SGD</p>
                            <p>Valuable Items: {rule.valuable_items} SGD</p>
                        </div>
                    ))}
                    {addons.map(addon => addon.type == 'mm to sg' && (
                        <div className="mt-4 bg-white rounded-xl p-8" key={addon.id}>
                            <p className="mb-4 text-lg text-amber-600 font-bold">{addon.name}</p>
                            <ul>
                                {addon.choices.map(choice => (
                                    <li key={choice.id}>
                                        <p>{choice.name} - {choice.fee} SGD</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div>
                    <p className="text-lg bg-white px-8 py-2 rounded-xl mb-4 text-amber-600 font-bold">SG to MM</p>
                    {rules.map(rule => rule.type == 'sg to mm' && (
                        <div className="grid grid-cols-1 gap-4 rounded-xl bg-white p-8" key={rule.id}>
                            <p className="text-lg text-amber-600 font-bold">{rule.shipping_method.toUpperCase()}</p>
                            <p>Foods: {rule.foods} SGD</p>
                            <p>Clothes: {rule.clothes} SGD</p>
                            <p>Shoes and Bags: {rule.shoes_and_bags} SGD</p>
                            <p>Cosmetics: {rule.cosmetics} SGD</p>
                            <p>Medicines: {rule.medicines} SGD</p>
                            <p>Supplements: {rule.supplements} SGD</p>
                            <p>Valuable Items: {rule.valuable_items} SGD</p>
                        </div>
                    ))}
                    {addons.map(addon => addon.type == 'sg to mm' && (
                        <div className="mt-4 bg-white rounded-xl p-8" key={addon.id}>
                            <p className="mb-4 text-lg text-amber-600 font-bold">{addon.name}</p>
                            <ul>
                                {addon.choices.map(choice => (
                                    <li key={choice.id}>
                                        <p>{choice.name} - {choice.fee} SGD</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Rules;
