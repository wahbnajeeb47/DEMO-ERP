// Dynamic routing initialization
function switchTab(tabName) {
    // Hide all panels
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    // Remove active style from all tab listings
    document.querySelectorAll('.nav-links li').forEach(item => {
        item.classList.remove('active');
    });

    // Activate selected section
    document.getElementById(`section-${tabName}`).style.display = 'block';
    document.getElementById(`tab-${tabName}`).classList.add('active');

    // If navigating to inventory database or dashboard summary, refresh content layers
    if (tabName === 'inventory') {
        renderInventoryTable();
    } else if (tabName === 'dashboard') {
        renderDashboardInsights();
    }
}

// Transaction calculation logic
function calculateInvoice() {
    const qty = parseFloat(document.getElementById('quantity').value) || 0;
    const price = parseFloat(document.getElementById('unitPrice').value) || 0;

    const subtotal = qty * price;
    const tax = subtotal * 0.02; 
    const grandTotal = subtotal + tax;

    document.getElementById('subtotalLabel').innerText = "PKR " + subtotal.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById('taxLabel').innerText = "PKR " + tax.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById('totalLabel').innerText = "PKR " + grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2});
}

// Data persistence engine utilizing arrays inside localStorage 
function saveInvoice() {
    const customer = document.getElementById('customerName').value.trim();
    const item = document.getElementById('productItem').value;
    const qty = document.getElementById('quantity').value;
    const price = document.getElementById('unitPrice').value;
    const date = document.getElementById('billingDate').value;

    if (!customer || !qty || !price) {
        alert("Bhai, pehle saari details (Customer, Quantity, Price) sahi se fill karo!");
        return;
    }

    const calculatedTotal = (parseFloat(qty) * parseFloat(price) * 1.02).toFixed(2);

    const invoiceData = {
        date: date,
        customerName: customer,
        productItem: item,
        quantity: qty,
        unitPrice: price,
        grandTotal: calculatedTotal
    };

    // Load existing relational records array or create an empty one
    let invoiceDatabase = JSON.parse(localStorage.getItem('invoiceDatabase')) || [];
    
    // Push new structured payload object into storage layer
    invoiceDatabase.push(invoiceData);
    localStorage.setItem('invoiceDatabase', JSON.stringify(invoiceDatabase));

    alert(`🎉 Invoice Saved Locally!\nCustomer: ${invoiceData.customerName}\nTotal Amount: PKR ${parseFloat(calculatedTotal).toLocaleString()}`);
    clearForm();
}

// Tab component render engine for relational layout lists
function renderInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    const invoiceDatabase = JSON.parse(localStorage.getItem('invoiceDatabase')) || [];

    tbody.innerHTML = ''; // Wipe existing rows to prevent duplicated prints

    if (invoiceDatabase.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #94a3b8;">Koi data saved nahi mila. Pehle billing tab se invoice create karein!</td></tr>`;
        return;
    }

    // Build data cells iteratively from operational collection records
    invoiceDatabase.reverse().forEach(inv => {
        const row = document.createElement('tr');
        row.style.borderBottom = "1px solid #e2e8f0";
        row.innerHTML = `
            <td style="padding: 12px; font-size: 14px;">${inv.date}</td>
            <td style="padding: 12px; font-size: 14px; font-weight: 600;">${inv.customerName}</td>
            <td style="padding: 12px; font-size: 14px; color: #475569;">${inv.productItem}</td>
            <td style="padding: 12px; font-size: 14px;">${inv.quantity}</td>
            <td style="padding: 12px; font-size: 14px;">${parseFloat(inv.unitPrice).toLocaleString()}</td>
            <td style="padding: 12px; font-size: 14px; font-weight: 600; color: #0369a1;">PKR ${parseFloat(inv.grandTotal).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// Logic engine computation layer for aggregated totals dashboard data displays
function renderDashboardInsights() {
    const invoiceDatabase = JSON.parse(localStorage.getItem('invoiceDatabase')) || [];
    let accumulationTotal = 0;

    invoiceDatabase.forEach(inv => {
        accumulationTotal += parseFloat(inv.grandTotal) || 0;
    });

    document.getElementById('totalSalesInsight').innerText = "PKR " + accumulationTotal.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById('totalCountInsight').innerText = invoiceDatabase.length + " Records";
}

function clearForm() {
    document.getElementById('customerName').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('unitPrice').value = '';
    document.getElementById('subtotalLabel').innerText = "PKR 0.00";
    document.getElementById('taxLabel').innerText = "PKR 0.00";
    document.getElementById('totalLabel').innerText = "PKR 0.00";
}

function clearDatabase() {
    if (confirm("Kya aap saara saved data clean karna chahte hain?")) {
        localStorage.removeItem('invoiceDatabase');
        renderInventoryTable();
    }
}