document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const guestsTrigger = document.getElementById('guestsTrigger');
    const guestsDropdown = document.getElementById('guestsDropdown');
    const applyGuests = document.getElementById('applyGuests');
    const guestsDisplay = document.getElementById('guestsDisplay');

    const adultsValue = document.getElementById('adultsValue');
    const adultsMinus = document.getElementById('adultsMinus');
    const adultsPlus = document.getElementById('adultsPlus');

    const childrenValue = document.getElementById('childrenValue');
    const childrenMinus = document.getElementById('childrenMinus');
    const childrenPlus = document.getElementById('childrenPlus');

    const checkinInput = document.getElementById('checkinInput');
    const checkoutInput = document.getElementById('checkoutInput');
    
    // New Tour Route Elements
    const routeTrigger = document.getElementById('routeTrigger');
    const routeDropdown = document.getElementById('routeDropdown');
    const applyRoute = document.getElementById('applyRoute');
    const routeDisplay = document.getElementById('routeDisplay');
    const routeCheckboxes = document.querySelectorAll('.route-checkbox');
    
    const searchBtn = document.getElementById('searchBtn');

    // Guest limits
    const minAdults = 1;
    const maxAdults = 10;
    const minChildren = 0;
    const maxChildren = 10;

    // Set Default Dates (Today & Today + 4 days)
    const today = new Date();
    const defaultCheckout = new Date(today);
    defaultCheckout.setDate(defaultCheckout.getDate() + 4);

    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (checkinInput && checkoutInput) {
        // Set initial values
        checkinInput.value = formatDate(today);
        checkinInput.min = formatDate(today);
        checkoutInput.value = formatDate(defaultCheckout);

        // Make check-out readonly — always auto-calculated as check-in + 4 days
        checkoutInput.readOnly = true;
        checkoutInput.style.cursor = 'not-allowed';
        checkoutInput.style.opacity = '0.7';
        checkoutInput.style.pointerEvents = 'none';

        // Auto-set check-out to check-in + 4 days whenever check-in changes
        checkinInput.addEventListener('change', () => {
            if (!checkinInput.value) return;
            const checkinDate = new Date(checkinInput.value + 'T00:00:00');
            const checkoutDate = new Date(checkinDate);
            checkoutDate.setDate(checkoutDate.getDate() + 4);
            checkoutInput.value = formatDate(checkoutDate);
        });
    }

    // Modern Date Picker opener on container click
    const dateTrigger = document.getElementById('dateTrigger');
    if (dateTrigger) {
        dateTrigger.addEventListener('click', (e) => {
            const box = e.target.closest('.date-input-box');
            if (box) {
                const input = box.querySelector('input[type="date"]');
                if (input) {
                    try {
                        if (typeof input.showPicker === 'function') {
                            input.showPicker();
                        } else {
                            input.focus();
                            input.click();
                        }
                    } catch (err) {
                        input.focus();
                        input.click();
                    }
                }
            }
        });
    }

    // Toggle Dropdowns safely
    if (guestsTrigger && guestsDropdown) {
        guestsTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (routeDropdown) routeDropdown.classList.remove('show');
            guestsDropdown.classList.toggle('show');
        });

        guestsDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    if (routeTrigger && routeDropdown) {
        routeTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (guestsDropdown) guestsDropdown.classList.remove('show');
            routeDropdown.classList.toggle('show');
        });

        routeDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Global click listener to close open dropdowns
    document.addEventListener('click', () => {
        if (guestsDropdown) guestsDropdown.classList.remove('show');
        if (routeDropdown) routeDropdown.classList.remove('show');
    });

    // Handle Increments / Decrements (Guests)
    const updateButtonsState = () => {
        if (!adultsValue || !childrenValue) return;
        const adults = parseInt(adultsValue.textContent, 10);
        const children = parseInt(childrenValue.textContent, 10);

        if (adultsMinus) adultsMinus.disabled = adults <= minAdults;
        if (adultsPlus) adultsPlus.disabled = adults >= maxAdults;

        if (childrenMinus) childrenMinus.disabled = children <= minChildren;
        if (childrenPlus) childrenPlus.disabled = children >= maxChildren;
    };

    if (adultsPlus) {
        adultsPlus.addEventListener('click', (e) => {
            e.preventDefault();
            let val = parseInt(adultsValue.textContent, 10);
            if (val < maxAdults) {
                adultsValue.textContent = val + 1;
                updateButtonsState();
            }
        });
    }

    if (adultsMinus) {
        adultsMinus.addEventListener('click', (e) => {
            e.preventDefault();
            let val = parseInt(adultsValue.textContent, 10);
            if (val > minAdults) {
                adultsValue.textContent = val - 1;
                updateButtonsState();
            }
        });
    }

    if (childrenPlus) {
        childrenPlus.addEventListener('click', (e) => {
            e.preventDefault();
            let val = parseInt(childrenValue.textContent, 10);
            if (val < maxChildren) {
                childrenValue.textContent = val + 1;
                updateButtonsState();
            }
        });
    }

    if (childrenMinus) {
        childrenMinus.addEventListener('click', (e) => {
            e.preventDefault();
            let val = parseInt(childrenValue.textContent, 10);
            if (val > minChildren) {
                childrenValue.textContent = val - 1;
                updateButtonsState();
            }
        });
    }

    // Apply button click (Guests)
    const updateGuestsDisplay = () => {
        if (!adultsValue || !childrenValue || !guestsDisplay) return;
        const adults = adultsValue.textContent;
        const children = childrenValue.textContent;
        guestsDisplay.textContent = `${adults} Adults · ${children} Children`;
    };

    if (applyGuests) {
        applyGuests.addEventListener('click', (e) => {
            e.preventDefault();
            updateGuestsDisplay();
            guestsDropdown.classList.remove('show');
        });
    }

    // Apply button click (Tour Route)
    const updateRouteDisplay = () => {
        if (!routeDisplay || !routeCheckboxes) return;
        const selected = [];
        routeCheckboxes.forEach(cb => {
            if (cb.checked) {
                selected.push(cb.value === 'More' ? 'More...' : cb.value);
            }
        });
        if (selected.length > 0) {
            routeDisplay.textContent = selected.join(', ');
        } else {
            routeDisplay.textContent = 'Select destinations';
        }
    };

    if (applyRoute) {
        applyRoute.addEventListener('click', (e) => {
            e.preventDefault();
            updateRouteDisplay();
            routeDropdown.classList.remove('show');
        });
    }

    // ============================================================
    // DESTINATION DATA — days & price per person (EGP)
    // ============================================================
    const destinationData = {
        'Aswan':                          { days: 2, pricePerPerson: 2500, icon: 'fa-water' },
        'Abu Simbel Temple':              { days: 1, pricePerPerson: 1800, icon: 'fa-monument' },
        'Philae Temple':                  { days: 1, pricePerPerson: 1200, icon: 'fa-place-of-worship' },
        'Kom Ombo Temple':                { days: 1, pricePerPerson: 1000, icon: 'fa-place-of-worship' },
        'Edfu Temple':                    { days: 1, pricePerPerson: 1100, icon: 'fa-place-of-worship' },
        'Mortuary Temple of Hatshepsut':  { days: 1, pricePerPerson: 1300, icon: 'fa-landmark' },
        'Valley of the Kings':            { days: 2, pricePerPerson: 2200, icon: 'fa-crown' },
        'Karnak Temple':                  { days: 1, pricePerPerson: 1500, icon: 'fa-columns' },
        'Luxor Temple':                   { days: 1, pricePerPerson: 1400, icon: 'fa-columns' },
        'Luxor':                          { days: 3, pricePerPerson: 3500, icon: 'fa-city' }
    };

    // ============================================================
    // RENDER BOOKED DESTINATIONS SECTION
    // ============================================================
    const renderBookedSection = () => {
        const bookedEmpty   = document.getElementById('booked-empty');
        const bookedContent = document.getElementById('booked-content');
        const bookedTbody   = document.getElementById('booked-tbody');
        const tripCheckin   = document.getElementById('trip-checkin');
        const tripCheckout  = document.getElementById('trip-checkout');
        const tripGuests    = document.getElementById('trip-guests');
        const statDest      = document.getElementById('stat-destinations');
        const statDays      = document.getElementById('stat-days');
        const statTotal     = document.getElementById('stat-total');

        if (!bookedEmpty || !bookedContent || !bookedTbody) return;

        // Collect selected destinations
        const selected = [];
        routeCheckboxes.forEach(cb => {
            if (cb.checked) selected.push(cb.value);
        });

        if (selected.length === 0) {
            bookedEmpty.style.display = 'block';
            bookedContent.classList.remove('visible');
            return;
        }

        // Get guests count
        const adults      = adultsValue   ? parseInt(adultsValue.textContent, 10)   : 1;
        const children    = childrenValue ? parseInt(childrenValue.textContent, 10) : 0;
        const totalGuests = adults + children;

        // Dates
        const checkinVal  = checkinInput  ? checkinInput.value  : '';
        const checkoutVal = checkoutInput ? checkoutInput.value : '';

        // Fill trip info bar
        if (tripCheckin)  tripCheckin.textContent  = formatDisplayDate(checkinVal);
        if (tripCheckout) tripCheckout.textContent = formatDisplayDate(checkoutVal);
        if (tripGuests)   tripGuests.textContent   =
            `${adults} Adult${adults !== 1 ? 's' : ''}` +
            (children > 0 ? ` · ${children} Child${children !== 1 ? 'ren' : ''}` : '');

        // Build table rows
        bookedTbody.innerHTML = '';

        selected.forEach((destName, index) => {
            const data = destinationData[destName] || { icon: 'fa-map-pin' };

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div style="display:flex;align-items:center;gap:0;">
                        <span class="booked-dest-icon"><i class="fa-solid ${data.icon}"></i></span>
                        <span class="booked-dest-name">${destName}</span>
                    </div>
                </td>
            `;
            bookedTbody.appendChild(tr);
        });

        // Update summary stats — Grand Total is always fixed at 40,000 EGP
        if (statDest)  statDest.textContent  = selected.length;
        if (statTotal) statTotal.textContent = '35,000 EGP';

        // Show content, hide empty state
        bookedEmpty.style.display = 'none';
        bookedContent.classList.add('visible');

        // Smooth scroll to section after brief delay
        const section = document.getElementById('booked-section');
        if (section) {
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 250);
        }
    };

    // ============================================================
    // SEARCH / BOOK NOW BUTTON
    // ============================================================
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update button to "Booked" state
            searchBtn.classList.add('booked');
            const btnText = searchBtn.querySelector('span');
            const btnIcon = searchBtn.querySelector('i');
            if (btnText) btnText.textContent = 'Booked';
            if (btnIcon) btnIcon.className = 'fa-solid fa-circle-check';

            // Populate booked section
            renderBookedSection();
        });
    }

    // ============================================================
    // CLEAR BOOKING BUTTON
    // ============================================================
    const clearBookingBtn = document.getElementById('clear-booking-btn');
    if (clearBookingBtn) {
        clearBookingBtn.addEventListener('click', () => {
            // Uncheck all route checkboxes
            routeCheckboxes.forEach(cb => { cb.checked = false; });
            updateRouteDisplay();

            // Reset Book Now button
            if (searchBtn) {
                searchBtn.classList.remove('booked');
                const btnText = searchBtn.querySelector('span');
                const btnIcon = searchBtn.querySelector('i');
                if (btnText) btnText.textContent = 'Book Now';
                if (btnIcon) btnIcon.className = 'fa-solid fa-calendar-check';
            }

            // Show empty state, hide content
            const bookedEmpty   = document.getElementById('booked-empty');
            const bookedContent = document.getElementById('booked-content');
            if (bookedEmpty)   bookedEmpty.style.display = 'block';
            if (bookedContent) bookedContent.classList.remove('visible');
        });
    }

    // ============================================================
    // CONFIRM BOOKING BUTTON
    // ============================================================
    const confirmBookingBtn = document.getElementById('confirm-booking-btn');
    if (confirmBookingBtn) {
        confirmBookingBtn.addEventListener('click', () => {
            // Read current totals from the summary cards
            const destCount = document.getElementById('stat-destinations')?.textContent || '0';

            // Show animated confirmation toast
            showConfirmToast(destCount);

            // Briefly animate the button
            confirmBookingBtn.disabled = true;
            confirmBookingBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

            setTimeout(() => {
                confirmBookingBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Confirmed!';
                confirmBookingBtn.style.background = 'linear-gradient(135deg, #065f46, #047857)';
            }, 1200);
        });
    }

    // ============================================================
    // CONFIRM TOAST NOTIFICATION
    // ============================================================
    function showConfirmToast(destinations) {
        // Remove any existing toast
        const existing = document.getElementById('confirm-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'confirm-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 32px;
            right: 32px;
            background: #0a0a0a;
            color: #fff;
            padding: 0;
            border-radius: 20px;
            box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07);
            display: flex;
            flex-direction: column;
            width: 320px;
            z-index: 9999;
            transform: translateY(140px) scale(0.95);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-family: 'Outfit', sans-serif;
            overflow: hidden;
        `;
        toast.innerHTML = `
            <!-- Header bar -->
            <div style="
                background: linear-gradient(135deg, #003b95 0%, #0052cc 100%);
                padding: 16px 20px;
                display: flex;
                align-items: center;
                gap: 12px;
            ">
                <div style="
                    width: 38px; height: 38px;
                    background: rgba(255,255,255,0.15);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                ">
                    <i class="fa-solid fa-circle-check" style="font-size:1.2rem;color:#4ade80;"></i>
                </div>
                <div>
                    <div style="font-weight:800;font-size:1rem;letter-spacing:0.3px;">Booking Confirmed!</div>
                    <div style="font-size:0.75rem;opacity:0.7;margin-top:1px;">Your journey is reserved</div>
                </div>
            </div>

            <!-- Body -->
            <div style="padding: 16px 20px; display:flex; flex-direction:column; gap:10px;">

                <!-- Destinations row -->
                <div style="
                    display:flex; align-items:center; gap:12px;
                    background: rgba(255,255,255,0.05);
                    border-radius:10px; padding:10px 14px;
                    border: 1px solid rgba(255,255,255,0.07);
                ">
                    <div style="
                        width:32px; height:32px;
                        background: rgba(254,187,2,0.15);
                        border-radius:8px;
                        display:flex; align-items:center; justify-content:center;
                        flex-shrink:0;
                    ">
                        <i class="fa-solid fa-map-location-dot" style="color:#febb02;font-size:0.9rem;"></i>
                    </div>
                    <div>
                        <div style="font-size:0.72rem;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.8px;">Destinations</div>
                        <div style="font-size:0.95rem;font-weight:700;">${destinations} Destination${destinations !== '1' ? 's' : ''}</div>
                    </div>
                </div>

                <!-- Grand Total row -->
                <div style="
                    display:flex; align-items:center; gap:12px;
                    background: rgba(74,222,128,0.08);
                    border-radius:10px; padding:10px 14px;
                    border: 1px solid rgba(74,222,128,0.2);
                ">
                    <div style="
                        width:32px; height:32px;
                        background: rgba(74,222,128,0.15);
                        border-radius:8px;
                        display:flex; align-items:center; justify-content:center;
                        flex-shrink:0;
                    ">
                        <i class="fa-solid fa-money-bill-wave" style="color:#4ade80;font-size:0.9rem;"></i>
                    </div>
                    <div>
                        <div style="font-size:0.72rem;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.8px;">Grand Total</div>
                        <div style="font-size:1rem;font-weight:800;color:#4ade80;">35,000 EGP</div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div style="
                border-top: 1px solid rgba(255,255,255,0.07);
                padding: 10px 20px;
                font-size:0.72rem;
                color:rgba(255,255,255,0.4);
                display:flex; align-items:center; gap:6px;
            ">
                <i class="fa-regular fa-clock" style="font-size:0.7rem;"></i>
                Our team will contact you shortly
            </div>
        `;

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.style.transform = 'translateY(0) scale(1)';
                toast.style.opacity = '1';
            });
        });

        // Animate out after 5 seconds
        setTimeout(() => {
            toast.style.transform = 'translateY(140px) scale(0.95)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }

    // Initial button state set
    updateButtonsState();
});
