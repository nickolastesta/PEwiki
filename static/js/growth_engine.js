let currentActiveDino = null;
let combatModeActive = false; // стан перемикача бойового режиму (зберігається між оновленнями повзунка)

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

const MECHANICS = {

  default: function(context, params = {}) {
    const { currentStage, nextStage, factor } = context;
    const atk2Info = document.getElementById('atk2-info');
    const container = document.getElementById('custom-ability-container');

    const dmg = Math.round(lerp(currentStage.m2.dmg, nextStage.m2.dmg, factor));
    const cd = currentStage.m2.cd;
    const staminaCost = currentStage.m2.staminaCost;
    const bleedDmg = lerp(currentStage.m2.bleedDmg || 0, nextStage.m2.bleedDmg || 0, factor);
    const bleedDuration = currentStage.m2.bleedDuration || 0;

    if (atk2Info) {
      let text = `Шкода: ${dmg} | Кулдаун: ${cd}с | Стаміна: ${staminaCost}`;
      if (bleedDmg > 0) {
        text += ` | Кровотеча: ${bleedDmg.toFixed(1)}/с (${bleedDuration}с)`;
      }
      atk2Info.textContent = text;
    }

    if (container) {
      container.innerHTML = '';
    }
  },

  bearTrap: function(context, params = {}) {
    const { currentStage, nextStage, factor, currentLmbDmg } = context;
    const container = document.getElementById('custom-ability-container');
    const atk2Info = document.getElementById('atk2-info');

    const minGrowth = params.minGrowth !== undefined ? params.minGrowth : 58;

    if (currentStage.m2.hasBearTrap) {
      const minCharge = Math.round(currentLmbDmg * 1.25);
      const maxCharge = Math.round(currentLmbDmg * 2.3148);
      const currentChargeBonus = (lerp(currentStage.m2.chargeBonus || 0, nextStage.m2.chargeBonus || 0, factor)).toFixed(1);

      if (atk2Info) {
        atk2Info.textContent = `"Капкан" (Заряджається до 10с) | Стаміна: ${currentStage.m2.staminaCost}`;
      }
      if (container) {
        container.innerHTML = `
          <div class="ability-box">
            <strong>"Капкан" (Зарядка):</strong><br>
            • Мін. заряд (0 сек): <span class="stat-val">${minCharge}</span> HP<br>
            • Макс. заряд (10 сек): <span class="stat-val">${maxCharge}</span> HP (+${currentChargeBonus}/сек) (+85%)
          </div>
        `;
      }
    } else {
      const currentRmbDmg = Math.round(lerp(currentStage.m2.dmg, nextStage.m2.dmg, factor));
      if (atk2Info) {
        atk2Info.textContent = `Шкода: ${currentRmbDmg} | Кулдаун: ${currentStage.m2.cd}с | Стаміна: ${currentStage.m2.staminaCost}`;
      }
      if (container) {
        container.innerHTML = `
          <div class="ability-box" style="border-left-color: #888;">
            <strong>Особливість атак:</strong><br>
            <span style="color: #aaa; font-size: 0.9em;">
              Механіка <strong>"Капкан"</strong> відкривається з росту <strong>${minGrowth}%</strong>.
            </span>
          </div>
        `;
      }
    }
  },

  tailAngle: function(context, params = {}) {
    const { currentGrowth, currentStage, nextStage, factor } = context;
    const container = document.getElementById('custom-ability-container');
    const atk2Info = document.getElementById('atk2-info');

    const mults = params.multipliers || [1.0, 1.0, 1.1, 1.25];
    const stCosts = params.staminaCosts || [3, 3, 6, 8];
    const minGrowth = params.minGrowth !== undefined ? params.minGrowth : 43;

    const baseTailDmg = Math.round(lerp(currentStage.m2.dmg, nextStage.m2.dmg, factor));
    const baseBleedRate = lerp(currentStage.m2.bleedDmg || 0, nextStage.m2.bleedDmg || 0, factor);
    const bleedDuration = currentStage.m2.bleedDuration || 0;

    if (currentGrowth < minGrowth) {
      if (atk2Info) {
        atk2Info.textContent = `Удар хвостом | Шкода: ${baseTailDmg} HP | Кровотеча: ${baseBleedRate.toFixed(1)}/с (${bleedDuration}с)`;
      }
      if (container) {
        container.innerHTML = `
          <div class="ability-box" style="border-left-color: #888;">
            <strong>Особливість атак хвостом:</strong><br>
            <span style="color: #aaa; font-size: 0.9em;">
              Механіка миттєвого розвороту відкривається з росту <strong>${minGrowth}%</strong>.
            </span>
          </div>
        `;
      }
      return;
    }

    if (atk2Info) {
      atk2Info.textContent = `Удар хвостом (Залежить від кута) | Базова шкода: ${baseTailDmg} HP`;
    }

    if (container) {
      const getBonusText = (m) => {
        const percent = Math.round((m - 1.0) * 100);
        return percent > 0 ? ` (+${percent}%)` : '';
      };

      container.innerHTML = `
        <div class="ability-box">
          <strong>Механіка миттєвого розвороту:</strong><br>
          <label for="angle-select" style="font-size:0.9em; color:#ffb74d;">Обери кут розвороту:</label>
          <select id="angle-select" style="background:#1e1e1e; color:#fff; border:1px solid #ff9800; padding:6px; margin-top:5px; border-radius:4px; width:100%; cursor:pointer;">
            <option value="0">0° (На місці) — ${mults[0]}x шкоди${getBonusText(mults[0])}</option>
            <option value="1">45° розворот — ${mults[1]}x шкоди${getBonusText(mults[1])}</option>
            <option value="2">90° розворот — ${mults[2]}x шкоди${getBonusText(mults[2])}</option>
            <option value="3">180° розворот — ${mults[3]}x шкоди${getBonusText(mults[3])}</option>
          </select>
          <div id="angle-stats-output" style="margin-top:10px; font-size:0.9em;"></div>
        </div>
      `;

      const selectEl = document.getElementById('angle-select');
      const outputEl = document.getElementById('angle-stats-output');

      function calculateAngleStats() {
        const idx = Number(selectEl.value);
        const multiplier = mults[idx];
        const staminaCost = stCosts[idx];

        const calculatedDmg = Math.round(baseTailDmg * multiplier);
        const calculatedBleed = (baseBleedRate * multiplier).toFixed(1);

        outputEl.innerHTML = `
          • <strong>Шкода від удару:</strong> <span class="stat-val">${calculatedDmg}</span> HP<br>
          • <strong>Кровотеча:</strong> <span class="stat-val">${calculatedBleed}</span> HP/сек (Тривалість: <span class="stat-val">${bleedDuration}с</span>)<br>
          • <strong>Витрата витривалості:</strong> <span class="stat-val">${staminaCost}</span>
        `;
      }

      selectEl.addEventListener('change', calculateAngleStats);
      calculateAngleStats();
    }
  },

  // ─────────────────────────────────────────────────────────────
  // БОЙОВИЙ РЕЖИМ
  // Очікує в кожному keyframe об'єкт "combat":
  //   combat: {
  //     staminaCost: number,           // витрата на активацію/підтримку режиму
  //     walk, run, sprint, swim: number,
  //     m1: { dmg, cd, staminaCost, bleedDmg?, bleedDuration? },
  //     m2: { dmg, cd, staminaCost, bleedDmg?, bleedDuration? }
  //   }
  // params: { minGrowth: number } — ріст, з якого режим стає доступним
  // ─────────────────────────────────────────────────────────────
  combatMode: function(context, params = {}) {
    const { currentGrowth, currentStage, nextStage, factor } = context;
    const atk2Info = document.getElementById('atk2-info');
    const container = document.getElementById('custom-ability-container');
    const minGrowth = params.minGrowth !== undefined ? params.minGrowth : 50;

    const parseSpeed = (v) => (typeof v === 'string' ? parseFloat(v) : v);

    // Поки механіка не розблокована (або даних combat немає) — звичайна поведінка + підказка
    if (currentGrowth < minGrowth || !currentStage.combat) {
      const dmg = Math.round(lerp(currentStage.m2.dmg, nextStage.m2.dmg, factor));
      const cd = currentStage.m2.cd;
      const staminaCost = currentStage.m2.staminaCost;
      const bleedDmg = lerp(currentStage.m2.bleedDmg || 0, nextStage.m2.bleedDmg || 0, factor);
      const bleedDuration = currentStage.m2.bleedDuration || 0;

      if (atk2Info) {
        let text = `Шкода: ${dmg} | Кулдаун: ${cd}с | Стаміна: ${staminaCost}`;
        if (bleedDmg > 0) {
          text += ` | Кровотеча: ${bleedDmg.toFixed(1)}/с (${bleedDuration}с)`;
        }
        atk2Info.textContent = text;
      }

      if (container) {
        container.innerHTML = `
          <div class="ability-box" style="border-left-color: #888;">
            <strong>Особливість атак:</strong><br>
            <span style="color: #aaa; font-size: 0.9em;">
              Механіка <strong>"Бойовий режим"</strong> відкривається з росту <strong>${minGrowth}%</strong>.
            </span>
          </div>
        `;
      }
      combatModeActive = false;
      return;
    }

    const cCombat = currentStage.combat;
    const nCombat = nextStage.combat || cCombat;

    const combatStaminaCost = lerp(cCombat.staminaCost || 0, nCombat.staminaCost || 0, factor);

    // Бойовий набір швидкостей
    const cbWalk = lerp(parseSpeed(cCombat.walk), parseSpeed(nCombat.walk), factor).toFixed(1);
    const cbRun = lerp(parseSpeed(cCombat.run), parseSpeed(nCombat.run), factor).toFixed(1);
    const cbSprint = lerp(parseSpeed(cCombat.sprint), parseSpeed(nCombat.sprint), factor).toFixed(1);
    const cbSwim = lerp(parseSpeed(cCombat.swim), parseSpeed(nCombat.swim), factor).toFixed(1);

    // Бойовий набір атак
    const cbM1Dmg = Math.round(lerp(cCombat.m1.dmg, nCombat.m1.dmg, factor));
    const cbM1Cd = cCombat.m1.cd;
    const cbM1Stamina = lerp(cCombat.m1.staminaCost || 0, nCombat.m1.staminaCost || 0, factor);

    const cbM2Dmg = Math.round(lerp(cCombat.m2.dmg, nCombat.m2.dmg, factor));
    const cbM2Cd = cCombat.m2.cd;
    const cbM2Stamina = cCombat.m2.staminaCost;
    const cbM2BleedDmg = lerp(cCombat.m2.bleedDmg || 0, nCombat.m2.bleedDmg || 0, factor);
    const cbM2BleedDuration = cCombat.m2.bleedDuration || 0;

    // Звичайний (не бойовий) набір
    const normWalk = lerp(parseSpeed(currentStage.base.walk), parseSpeed(nextStage.base.walk), factor).toFixed(1);
    const normRun = lerp(parseSpeed(currentStage.base.run), parseSpeed(nextStage.base.run), factor).toFixed(1);
    const normSprint = lerp(parseSpeed(currentStage.base.sprint), parseSpeed(nextStage.base.sprint), factor).toFixed(1);
    const normSwim = lerp(parseSpeed(currentStage.base.swim), parseSpeed(nextStage.base.swim), factor).toFixed(1);
    const normM1Dmg = Math.round(lerp(currentStage.m1.dmg, nextStage.m1.dmg, factor));
    const normM1Cd = currentStage.m1.cd;
    const normM1Stamina = lerp(currentStage.m1.staminaCost || 0, nextStage.m1.staminaCost || 0, factor);
    const normM2Dmg = Math.round(lerp(currentStage.m2.dmg, nextStage.m2.dmg, factor));
    const normM2Cd = currentStage.m2.cd;
    const normM2Stamina = currentStage.m2.staminaCost;
    const normM2BleedDmg = lerp(currentStage.m2.bleedDmg || 0, nextStage.m2.bleedDmg || 0, factor);
    const normM2BleedDuration = currentStage.m2.bleedDuration || 0;

    if (container) {
      container.innerHTML = `
        <div class="ability-box">
          <strong>Бойовий режим:</strong><br>
          <span style="font-size:0.9em; color:#ffb74d;">Витрата витривалості: <span class="stat-val">${combatStaminaCost.toFixed(1)}/сек</span></span><br>
          <label style="display:flex; align-items:center; gap:8px; margin-top:8px; cursor:pointer;">
            <input type="checkbox" id="combat-mode-toggle" ${combatModeActive ? 'checked' : ''} style="width:18px; height:18px; accent-color:#ff9800; cursor:pointer;">
            <span id="combat-toggle-label">Бойовий режим: ${combatModeActive ? 'Увімкнено' : 'Вимкнено'}</span>
          </label>
        </div>
      `;

      const toggleEl = document.getElementById('combat-mode-toggle');
      const labelEl = document.getElementById('combat-toggle-label');

      function applyMode() {
        if (toggleEl.checked) {
          document.getElementById('walk').textContent = `${cbWalk} м/с`;
          document.getElementById('run').textContent = `${cbRun} м/с`;
          document.getElementById('sprint').textContent = `${cbSprint} м/с`;
          document.getElementById('swim').textContent = `${cbSwim} м/с`;

          document.getElementById('atk1-dmg').textContent = cbM1Dmg;
          document.getElementById('atk1-cd').textContent = cbM1Cd;

          const atk1StaminaEl = document.getElementById('atk1-stamina');
          if (atk1StaminaEl) {
            atk1StaminaEl.textContent = cbM1Stamina.toFixed(1).replace(/\.0$/, '');
          }

          if (atk2Info) {
            let text = `Шкода: ${cbM2Dmg} | Перезарядка: ${cbM2Cd}с | Витрата витривалості: ${cbM2Stamina}`;
            if (cbM2BleedDmg > 0) {
              text += ` | Кровотеча: ${cbM2BleedDmg.toFixed(1)}/с (${cbM2BleedDuration}с)`;
            }
            atk2Info.textContent = text;
          }

          if (labelEl) labelEl.textContent = 'Бойовий режим: Увімкнено';
        } else {
          document.getElementById('walk').textContent = `${normWalk} м/с`;
          document.getElementById('run').textContent = `${normRun} м/с`;
          document.getElementById('sprint').textContent = `${normSprint} м/с`;
          document.getElementById('swim').textContent = `${normSwim} м/с`;

          document.getElementById('atk1-dmg').textContent = normM1Dmg;
          document.getElementById('atk1-cd').textContent = normM1Cd;

          const atk1StaminaEl = document.getElementById('atk1-stamina');
          if (atk1StaminaEl) {
            atk1StaminaEl.textContent = normM1Stamina.toFixed(1).replace(/\.0$/, '');
          }

          if (atk2Info) {
            let text = `Шкода: ${normM2Dmg} | Перезарядка: ${normM2Cd}с | Витрата витривалості: ${normM2Stamina}`;
            if (normM2BleedDmg > 0) {
              text += ` | Кровотеча: ${normM2BleedDmg.toFixed(1)}/с (${normM2BleedDuration}с)`;
            }
            atk2Info.textContent = text;
          }

          if (labelEl) labelEl.textContent = 'Бойовий режим: Вимкнено';
        }

        combatModeActive = toggleEl.checked;
      }

      toggleEl.addEventListener('change', applyMode);
      applyMode();
    }
  }
};

function updateDinoCard() {
  if (!currentActiveDino) return;

  const slider = document.getElementById('growth-slider');
  if (!slider) return;

  const val = Number(slider.value);
  document.getElementById('growth-percent').textContent = val + "%";

  let currentStage = currentActiveDino.keyframes[0];
  let nextStage = currentActiveDino.keyframes[currentActiveDino.keyframes.length - 1];

  for (let i = 0; i < currentActiveDino.keyframes.length - 1; i++) {
    if (val >= currentActiveDino.keyframes[i].base.progress && val < currentActiveDino.keyframes[i+1].base.progress) {
      currentStage = currentActiveDino.keyframes[i];
      nextStage = currentActiveDino.keyframes[i+1];
      break;
    }
  }

  if (val >= currentActiveDino.keyframes[currentActiveDino.keyframes.length - 1].base.progress) {
    currentStage = currentActiveDino.keyframes[currentActiveDino.keyframes.length - 1];
    nextStage = currentStage;
  }

  let factor = 0;
  if (nextStage.base.progress !== currentStage.base.progress) {
    factor = (val - currentStage.base.progress) / (nextStage.base.progress - currentStage.base.progress);
  }

  document.getElementById('stage-name').textContent = currentStage.base.name;

  // швидкості вже числа, але лишаємо parseFloat для сумісності зі старими файлами
  const parseSpeed = (v) => typeof v === 'string' ? parseFloat(v) : v;

  const currentHp = Math.round(lerp(currentStage.base.hp, nextStage.base.hp, factor));
  const currentWeight = lerp(currentStage.base.weight, nextStage.base.weight, factor).toFixed(1);
  const currentStamina = Math.round(lerp(currentStage.base.stamina, nextStage.base.stamina, factor));
  const currentLmbDmg = Math.round(lerp(currentStage.m1.dmg, nextStage.m1.dmg, factor));

  const currentWalk = lerp(parseSpeed(currentStage.base.walk), parseSpeed(nextStage.base.walk), factor).toFixed(1);
  const currentRun = lerp(parseSpeed(currentStage.base.run), parseSpeed(nextStage.base.run), factor).toFixed(1);
  const currentSprint = lerp(parseSpeed(currentStage.base.sprint), parseSpeed(nextStage.base.sprint), factor).toFixed(1);
  const currentSwim = lerp(parseSpeed(currentStage.base.swim), parseSpeed(nextStage.base.swim), factor).toFixed(1);

  document.getElementById('hp').textContent = currentHp;
  document.getElementById('weight').textContent = currentWeight;
  document.getElementById('stamina').textContent = currentStamina;
  document.getElementById('atk1-dmg').textContent = currentLmbDmg;
  document.getElementById('walk').textContent = `${currentWalk} м/с`;
  document.getElementById('run').textContent = `${currentRun} м/с`;
  document.getElementById('sprint').textContent = `${currentSprint} м/с`;
  document.getElementById('swim').textContent = `${currentSwim} м/с`;

  document.getElementById('armor').textContent = currentStage.base.armor;
  document.getElementById('atk1-cd').textContent = currentStage.m1.cd;

  // витрата стаміни основної атаки (m1) — показуємо завжди, навіть якщо 0
  const atk1StaminaWrap = document.getElementById('atk1-stamina-wrap');
  if (atk1StaminaWrap) {
    const atk1StaminaCost = lerp(currentStage.m1.staminaCost || 0, nextStage.m1.staminaCost || 0, factor);

    document.getElementById('atk1-stamina').textContent = atk1StaminaCost.toFixed(1).replace(/\.0$/, '');
    atk1StaminaWrap.style.display = '';
  }

  // кровотеча основної атаки (m1)
  const atk1BleedWrap = document.getElementById('atk1-bleed-wrap');
  if (atk1BleedWrap) {
    const atk1BleedDmg = lerp(currentStage.m1.bleedDmg || 0, nextStage.m1.bleedDmg || 0, factor);
    const atk1BleedDuration = currentStage.m1.bleedDuration || 0;

    if (atk1BleedDmg > 0) {
      document.getElementById('atk1-bleed').textContent = atk1BleedDmg.toFixed(1);
      document.getElementById('atk1-bleed-duration').textContent = atk1BleedDuration;
      atk1BleedWrap.style.display = '';
    } else {
      atk1BleedWrap.style.display = 'none';
    }
  }

  let mechanicName;
  let params = {};

  if (currentActiveDino.mechanic) {
    mechanicName = typeof currentActiveDino.mechanic === 'string'
      ? currentActiveDino.mechanic
      : currentActiveDino.mechanic.type;

    params = (typeof currentActiveDino.mechanic === 'object' && currentActiveDino.mechanic.params) || {};
  }

  // якщо механіка не вказана, порожня ({}) або не знайдена в MECHANICS - показуємо базову інформацію по m2
  const mechanicFn = (mechanicName && typeof MECHANICS[mechanicName] === 'function')
    ? MECHANICS[mechanicName]
    : MECHANICS.default;

  mechanicFn({
    val,
    currentGrowth: val,
    currentStage,
    nextStage,
    factor,
    currentLmbDmg
  }, params);

  const atk3Info = document.getElementById('atk3-info');
  if (atk3Info) {
    const m3 = currentStage.m3;
    const m3Next = nextStage.m3;
    const hasThirdAttack = m3 && (m3.dmg > 0 || m3.cd > 0 || m3.staminaCost > 0);
    const atk3Row = atk3Info.closest('li');

    if (hasThirdAttack) {
      const dmg = Math.round(lerp(m3.dmg, (m3Next && m3Next.dmg) ?? m3.dmg, factor));
      const cd = m3.cd;
      const staminaCost = m3.staminaCost;
      const bleedDmg = lerp(m3.bleedDmg || 0, (m3Next && m3Next.bleedDmg) || 0, factor);
      const bleedDuration = m3.bleedDuration || 0;

      let text = `Шкода: ${dmg} | Перезарядка: ${cd}с | Витрата витривалості: ${staminaCost}`;
      if (bleedDmg > 0) {
        text += ` | Кровотеча: ${bleedDmg.toFixed(1)}/с (${bleedDuration}с)`;
      }
      atk3Info.textContent = text;
      if (atk3Row) atk3Row.style.display = '';
    } else {
      if (atk3Row) atk3Row.style.display = 'none';
    }
  }
}

function loadDinoData(jsonPath) {
  fetch(jsonPath)
    .then(response => {
      if (!response.ok) throw new Error("Не вдалося завантажити JSON: " + response.statusText);
      return response.json();
    })
    .then(dinoData => {
      currentActiveDino = dinoData;
      combatModeActive = false; // скидаємо режим при завантаженні нового персонажа

      const desc = dinoData.description || "Опис персонажа відсутній.";
      document.getElementById('dino-title').innerHTML = `
        <span class="dino-title-text">${dinoData.title}</span>
        <details class="dino-desc-dropdown">
          <summary class="desc-toggle-btn" title="Опис персонажа">ⓘ</summary>
          <div class="desc-content">${desc}</div>
        </details>
      `;

      updateDinoCard();
    })
    .catch(err => console.error("Помилка завантаження даних:", err));
}

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('growth-slider');
  if (slider) {
    slider.addEventListener('input', updateDinoCard);
  }
});