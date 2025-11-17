
// COMMENT SYSTEM - DATA STORAGE

let comments = [];
let selectedRating = 0;


// INITIALIZATION

document.addEventListener('DOMContentLoaded', function() {
    initializeCommentSystem();
    initializeStarRating();
    initializeCharCounter();
    updateStatistics();
});


// STAR RATING SYSTEM

function initializeStarRating() {
    const stars = document.querySelectorAll('.star');
    const ratingDisplay = document.getElementById('ratingDisplay');

    stars.forEach(star => {
        // Hover effect
        star.addEventListener('mouseenter', function() {
            const value = parseInt(this.getAttribute('data-value'));
            highlightStars(value);
        });

        // Click to select
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-value'));
            highlightStars(selectedRating);
            ratingDisplay.textContent = `Selected: ${selectedRating} star${selectedRating > 1 ? 's' : ''}`;
        });
    });

    // Reset hover effect on mouse leave
    const starRating = document.getElementById('starRating');
    starRating.addEventListener('mouseleave', function() {
        highlightStars(selectedRating);
    });
}

function highlightStars(count) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < count) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}


// CHARACTER COUNTER

function initializeCharCounter() {
    const commentText = document.getElementById('commentText');
    const charCount = document.getElementById('charCount');

    commentText.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = length;

        // Change color based on character count
        if (length > 500) {
            charCount.style.color = '#e74c3c';
        } else if (length >= 400) {
            charCount.style.color = '#f39c12';
        } else {
            charCount.style.color = '#7f8c8d';
        }
    });
}


// FORM VALIDATION

function initializeCommentSystem() {
    const form = document.getElementById('commentForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Validate form
        if (validateForm()) {
            submitComment();
        }
    });

    // Real-time validation on blur
    document.getElementById('userName').addEventListener('blur', validateName);
    document.getElementById('userEmail').addEventListener('blur', validateEmail);
    document.getElementById('commentText').addEventListener('blur', validateComment);
}

function validateName() {
    const nameInput = document.getElementById('userName');
    const nameError = document.getElementById('nameError');
    const name = nameInput.value.trim();

    if (name === '') {
        showError(nameInput, nameError, 'Name should be between 2 and 50 characters');
        return false;
    }

    if (name.length < 2 || name.length > 50) {
        showError(nameInput, nameError, 'Name should be between 2 and 50 characters');
        return false;
    }

    clearFieldError(nameInput, nameError);
    return true;
}

function validateEmail() {
    const emailInput = document.getElementById('userEmail');
    const emailError = document.getElementById('emailError');
    const email = emailInput.value.trim();

    // Email is optional, but if provided must be valid
    if (email !== '' && !email.includes('@')) {
        showError(emailInput, emailError, 'Please enter a valid email address');
        return false;
    }

    clearFieldError(emailInput, emailError);
    return true;
}

function validateComment() {
    const commentInput = document.getElementById('commentText');
    const commentError = document.getElementById('commentError');
    const comment = commentInput.value.trim();

    if (comment === '') {
        showError(commentInput, commentError, 'Comment should between 10 and 500 characters');
        return false;
    }

    if (comment.length < 10 || comment.length > 500) {
        showError(commentInput, commentError, 'Comment should between 10 and 500 characters');
        return false;
    }

    clearFieldError(commentInput, commentError);
    return true;
}

function validateForm() {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isCommentValid = validateComment();

    return isNameValid && isEmailValid && isCommentValid;
}

function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
}

function clearFieldError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
}

function clearErrors() {
    const inputs = document.querySelectorAll('input, textarea');
    const errors = document.querySelectorAll('.error-message');

    inputs.forEach(input => input.classList.remove('error'));
    errors.forEach(error => error.textContent = '');
}


// SUBMIT COMMENT

function submitComment() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const commentText = document.getElementById('commentText').value.trim();
    const rating = selectedRating;

    // Create comment object
    const comment = {
        id: Date.now(),
        name: name,
        text: commentText,
        rating: rating,
        timestamp: new Date()
    };

    // Add to comments array
    comments.push(comment);

    // Display the new comment
    displayComment(comment);

    // Update statistics
    updateStatistics();

    // Reset form
    resetForm();

    // Show success message (optional)
    showSuccessMessage();
}


// DISPLAY COMMENTS

function displayComment(comment) {
    const commentsList = document.getElementById('commentsList');
    
    // Remove "no comments" message if exists
    const noComments = commentsList.querySelector('.no-comments');
    if (noComments) {
        noComments.remove();
    }

    // Create comment element
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item';
    commentDiv.innerHTML = `
        <div class="comment-header">
            <span class="comment-author">${escapeHtml(comment.name)}</span>
            ${comment.rating > 0 ? `<span class="comment-rating">${'★'.repeat(comment.rating)} (${comment.rating}/5)</span>` : ''}
        </div>
        <p class="comment-text">${escapeHtml(comment.text)}</p>
        <span class="comment-time">${formatTime(comment.timestamp)}</span>
    `;

    // Insert at the beginning (newest first)
    commentsList.insertBefore(commentDiv, commentsList.firstChild);
}


// UPDATE STATISTICS

function updateStatistics() {
    const totalCommentsElement = document.getElementById('totalComments');
    const avgRatingElement = document.getElementById('avgRating');

    // Update total comments
    totalCommentsElement.textContent = comments.length;

    // Calculate average rating
    const ratingsOnly = comments.filter(c => c.rating > 0);
    
    if (ratingsOnly.length > 0) {
        const sum = ratingsOnly.reduce((acc, comment) => acc + comment.rating, 0);
        const average = (sum / ratingsOnly.length).toFixed(1);
        avgRatingElement.textContent = average;
    } else {
        avgRatingElement.textContent = '0.0';
    }

    // Animate statistics update
    animateStatUpdate(totalCommentsElement);
    animateStatUpdate(avgRatingElement);
}

function animateStatUpdate(element) {
    element.style.transform = 'scale(1.2)';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 300);
}


// RESET FORM

function resetForm() {
    document.getElementById('commentForm').reset();
    selectedRating = 0;
    highlightStars(0);
    document.getElementById('ratingDisplay').textContent = 'No rating selected';
    document.getElementById('charCount').textContent = '0';
    clearErrors();
}


// UTILITY FUNCTIONS

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function showSuccessMessage() {
    // Create success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = '✓ Comment posted successfully!';
    
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}


// INITIAL NO COMMENTS MESSAGE

if (comments.length === 0) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first to share your thoughts!</p>';
}
