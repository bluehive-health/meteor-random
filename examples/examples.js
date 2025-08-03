// examples.js - Interactive functionality for the showcase page

// Mock Random object for demonstration purposes
// In a real implementation, this would be imported from the actual library
const Random = {
    id: function(length = 17) {
        const chars = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';
        return this._randomString(length, chars);
    },
    
    secret: function(length = 43) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
        return this._randomString(length, chars);
    },
    
    fraction: function() {
        // Using crypto.getRandomValues when available, fallback to Math.random
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            const array = new Uint32Array(1);
            crypto.getRandomValues(array);
            return array[0] / (0xffffffff + 1);
        }
        return Math.random();
    },
    
    hexString: function(digits) {
        const chars = '0123456789abcdef';
        return this._randomString(digits, chars);
    },
    
    choice: function(arrayOrString) {
        const index = Math.floor(this.fraction() * arrayOrString.length);
        return arrayOrString[index];
    },
    
    createWithSeeds: function(...seeds) {
        // Simple seeded random using a hash of the seeds
        let seed = 0;
        for (const s of seeds) {
            const str = String(s);
            for (let i = 0; i < str.length; i++) {
                seed = ((seed << 5) - seed + str.charCodeAt(i)) & 0xffffffff;
            }
        }
        
        // Simple LCG implementation for deterministic results
        let current = Math.abs(seed);
        
        return {
            id: (length = 17) => {
                const chars = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';
                return this._seededRandomString(current, length, chars);
            },
            
            secret: (length = 43) => {
                const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
                return this._seededRandomString(current, length, chars);
            },
            
            fraction: () => {
                current = (current * 1664525 + 1013904223) % Math.pow(2, 32);
                return current / Math.pow(2, 32);
            },
            
            hexString: (digits) => {
                const chars = '0123456789abcdef';
                return this._seededRandomString(current, digits, chars);
            }
        };
    },
    
    insecure: {
        id: function(length = 17) {
            const chars = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';
            return Random._randomString(length, chars);
        },
        
        secret: function(length = 43) {
            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
            return Random._randomString(length, chars);
        },
        
        fraction: function() {
            return Math.random();
        },
        
        hexString: function(digits) {
            const chars = '0123456789abcdef';
            return Random._randomString(digits, chars);
        }
    },
    
    _randomString: function(length, alphabet) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += alphabet.charAt(Math.floor(this.fraction() * alphabet.length));
        }
        return result;
    },
    
    _seededRandomString: function(seed, length, alphabet) {
        let result = '';
        let current = seed;
        for (let i = 0; i < length; i++) {
            current = (current * 1664525 + 1013904223) % Math.pow(2, 32);
            result += alphabet.charAt(Math.floor((current / Math.pow(2, 32)) * alphabet.length));
        }
        return result;
    }
};

// Interactive function implementations
function generateId() {
    const result = Random.id();
    document.getElementById('id-output').innerHTML = `<code class="font-mono text-blue-600">${result}</code>`;
}

function generateCustomId() {
    const result = Random.id(10);
    document.getElementById('id-output').innerHTML = `<code class="font-mono text-purple-600">${result}</code>`;
}

function generateSecret() {
    const result = Random.secret();
    document.getElementById('secret-output').innerHTML = `<code class="font-mono text-green-600 break-all">${result}</code>`;
}

function generateCustomSecret() {
    const result = Random.secret(20);
    document.getElementById('secret-output').innerHTML = `<code class="font-mono text-teal-600 break-all">${result}</code>`;
}

function generateFraction() {
    const result = Random.fraction();
    document.getElementById('fraction-output').innerHTML = `<code class="font-mono text-orange-600">${result.toFixed(10)}</code>`;
}

function generateRange() {
    const result = Math.floor(Random.fraction() * 100) + 1;
    document.getElementById('fraction-output').innerHTML = `<code class="font-mono text-red-600">${result}</code>`;
}

function generateHex8() {
    const result = Random.hexString(8);
    document.getElementById('hex-output').innerHTML = `<code class="font-mono text-indigo-600">${result}</code>`;
}

function generateHex16() {
    const result = Random.hexString(16);
    document.getElementById('hex-output').innerHTML = `<code class="font-mono text-pink-600">${result}</code>`;
}

function chooseColor() {
    const colors = ['red', 'green', 'blue', 'purple', 'orange', 'yellow', 'pink', 'indigo'];
    const colorNames = ['❤️ Red', '💚 Green', '💙 Blue', '💜 Purple', '🧡 Orange', '💛 Yellow', '💗 Pink', '💙 Indigo'];
    const colorClasses = ['text-red-600', 'text-green-600', 'text-blue-600', 'text-purple-600', 'text-orange-600', 'text-yellow-600', 'text-pink-600', 'text-indigo-600'];
    
    const index = Math.floor(Random.fraction() * colors.length);
    const result = colors[index];
    const displayName = colorNames[index];
    const colorClass = colorClasses[index];
    
    document.getElementById('choice-output').innerHTML = `<span class="font-semibold ${colorClass}">${displayName}</span> <code class="ml-2 text-gray-600">("${result}")</code>`;
}

function chooseEmoji() {
    const emojis = ['🎉', '🚀', '⭐', '🎯', '💫', '🔥', '⚡', '🌟', '🎨', '🎪', '🎭', '🎮'];
    const result = Random.choice(emojis);
    document.getElementById('choice-output').innerHTML = `<span class="text-2xl">${result}</span> <code class="ml-2 text-gray-600">Random.choice(['🎉', '🚀', '⭐', ...])</code>`;
}

function demonstrateSeeded() {
    const seeded1 = Random.createWithSeeds('demo', 'seed');
    const seeded2 = Random.createWithSeeds('demo', 'seed');
    
    const results1 = [seeded1.id(8), seeded1.fraction().toFixed(4), seeded1.hexString(4)];
    const results2 = [seeded2.id(8), seeded2.fraction().toFixed(4), seeded2.hexString(4)];
    
    document.getElementById('seeded-output').innerHTML = `
        <div class="space-y-2">
            <div><strong>Generator 1:</strong> <code class="text-blue-600">${results1.join(', ')}</code></div>
            <div><strong>Generator 2:</strong> <code class="text-green-600">${results2.join(', ')}</code></div>
            <div class="text-sm text-gray-600 mt-2">
                ✓ Both generators produce identical sequences when seeded with the same values
            </div>
        </div>
    `;
}

function performanceTest() {
    const iterations = 10000;
    
    // Test secure generation
    const startSecure = performance.now();
    for (let i = 0; i < iterations; i++) {
        Random.id(10);
    }
    const secureTime = performance.now() - startSecure;
    
    // Test insecure generation
    const startInsecure = performance.now();
    for (let i = 0; i < iterations; i++) {
        Random.insecure.id(10);
    }
    const insecureTime = performance.now() - startInsecure;
    
    const speedup = (secureTime / insecureTime).toFixed(1);
    
    document.getElementById('performance-output').innerHTML = `
        <div class="space-y-2">
            <div><strong>Secure:</strong> <span class="text-blue-600">${secureTime.toFixed(2)}ms</span> (${iterations.toLocaleString()} operations)</div>
            <div><strong>Insecure:</strong> <span class="text-green-600">${insecureTime.toFixed(2)}ms</span> (${iterations.toLocaleString()} operations)</div>
            <div class="text-sm text-gray-600 mt-2">
                ⚡ Insecure is ~${speedup}x faster (use only when security isn't critical)
            </div>
        </div>
    `;
}

function executeCustomFunction() {
    const functionSelect = document.getElementById('function-select');
    const lengthInput = document.getElementById('length-input');
    const selectedFunction = functionSelect.value;
    const length = parseInt(lengthInput.value) || 17;
    
    let result, code;
    
    switch (selectedFunction) {
        case 'id':
            result = Random.id(length);
            code = `Random.id(${length})`;
            break;
        case 'secret':
            result = Random.secret(length);
            code = `Random.secret(${length})`;
            break;
        case 'hexString':
            result = Random.hexString(length);
            code = `Random.hexString(${length})`;
            break;
        case 'fraction':
            result = Random.fraction().toFixed(10);
            code = `Random.fraction()`;
            break;
        default:
            result = 'Unknown function';
            code = 'Unknown function';
    }
    
    document.getElementById('generated-code').textContent = code;
    document.getElementById('custom-output').innerHTML = `<code class="text-purple-600 break-all">${result}</code>`;
}

// Update parameter section based on selected function
document.addEventListener('DOMContentLoaded', function() {
    const functionSelect = document.getElementById('function-select');
    const parameterSection = document.getElementById('parameter-section');
    const lengthInput = document.getElementById('length-input');
    
    functionSelect.addEventListener('change', function() {
        const selectedFunction = this.value;
        
        if (selectedFunction === 'fraction') {
            parameterSection.style.display = 'none';
        } else {
            parameterSection.style.display = 'block';
            
            // Set appropriate default values
            switch (selectedFunction) {
                case 'id':
                    lengthInput.value = 17;
                    break;
                case 'secret':
                    lengthInput.value = 43;
                    break;
                case 'hexString':
                    lengthInput.value = 8;
                    break;
            }
        }
        
        // Update the generated code preview
        executeCustomFunction();
    });
    
    // Initialize
    executeCustomFunction();
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for sticky nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
