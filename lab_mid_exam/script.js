// COMMENT SYSTEM - DATA STORAGE
let comments = [];
let comments2 = [];
let selectedRating = 0;
let selectedRating2 = 0;

// INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    initializeCommentSystem('commentForm', 'userName', 'userEmail', 'commentText', 'nameError', 'emailError', 'commentError', 'starRating', 'ratingDisplay', 'charCount', comments, 'totalComments', 'avgRating', 'commentsList', 1);
    initializeCommentSystem('commentForm2', 'userName2', 'userEmail2', 'commentText2', 'nameError2', 'emailError2', 'commentError2', 'starRating2', 'ratingDisplay2', 'charCount2', comments2, 'totalComments2', 'avgRating2', 'commentsList2', 2);
    
    // Initialize no comments messages
    const commentsList1 = document.getElementById('commentsList');
    const commentsList2 = document.getElementById('commentsList2');
    if (commentsList1) commentsList1.innerHTML = '<p class="no-comments">No comments yet. Be the first to share your thoughts!</p>';
    if (commentsList2) commentsList2.innerHTML = '<p class="no-comments">No comments yet. Be the first to share your thoughts!</p>';
});

// INITIALIZE COMMENT SYSTEM FOR EACH ARTICLE
function initializeCommentSystem(formId, nameId, emailId, commentId, nameErrorId, emailErrorId, commentErrorId, starRatingId, ratingDisplayId, charCountId, commentsArray, totalCommentsId, avgRatingId, commentsListId, articleNum) {
    const form = document.getElementById(formId);
    const commentText = document.getElementById(commentId);
    const charCount = document.getElementById(charCountId);
    const stars = document.querySelectorAll(`#${starRatingId} .star`);
    const ratingDisplay = document.getElementById(ratingDisplayId);
    const starRating = document.getElementById(starRatingId);
    
    if (!form) return;
    
    // Character counter
    commentText.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = length;
        if (length > 500) {
            charCount.style.color = '#e74c3c';
        } else if (length >= 400) {
            charCount.style.color = '#f39c12';
        } else {
            charCount.style.color = '#7f8c8d';
        }
    });
    
    // Star rating
    stars.forEach(star => {
        star.addEventListener('mouseenter', function() {
            const value = parseInt(this.getAttribute('data-value'));
            highlightStarsForArticle(starRatingId, value);
        });
        
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-value'));
            if (articleNum === 1) {
                selectedRating = rating;
            } else {
                selectedRating2 = rating;
            }
            highlightStarsForArticle(starRatingId, rating);
            ratingDisplay.textContent = `Selected: ${rating} star${rating > 1 ? 's' : ''}`;
        });
    });
    
    starRating.addEventListener('mouseleave', function() {
        const currentRating = articleNum === 1 ? selectedRating : selectedRating2;
        highlightStarsForArticle(starRatingId, currentRating);
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrorsForForm(formId);
        
        if (validateFormFields(nameId, emailId, commentId, nameErrorId, emailErrorId, commentErrorId)) {
            submitCommentForArticle(nameId, emailId, commentId, commentsArray, commentsListId, totalCommentsId, avgRatingId, formId, ratingDisplayId, charCountId, articleNum);
        }
    });
    
    // Real-time validation
    document.getElementById(nameId).addEventListener('blur', () => validateNameField(nameId, nameErrorId));
    document.getElementById(emailId).addEventListener('blur', () => validateEmailField(emailId, emailErrorId));
    document.getElementById(commentId).addEventListener('blur', () => validateCommentField(commentId, commentErrorId));
}

function highlightStarsForArticle(starRatingId, count) {
    const stars = document.querySelectorAll(`#${starRatingId} .star`);
    stars.forEach((star, index) => {
        if (index < count) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// VALIDATION FUNCTIONS
function validateNameField(nameId, errorId) {
    const nameInput = document.getElementById(nameId);
    const nameError = document.getElementById(errorId);
    const name = nameInput.value.trim();

    if (name === '' || name.length < 2 || name.length > 50) {
        showError(nameInput, nameError, 'Name should be between 2 and 50 characters');
        return false;
    }
    clearFieldError(nameInput, nameError);
    return true;
}

function validateEmailField(emailId, errorId) {
    const emailInput = document.getElementById(emailId);
    const emailError = document.getElementById(errorId);
    const email = emailInput.value.trim();

    if (email !== '' && !email.includes('@')) {
        showError(emailInput, emailError, 'Please enter a valid email address');
        return false;
    }
    clearFieldError(emailInput, emailError);
    return true;
}

function validateCommentField(commentId, errorId) {
    const commentInput = document.getElementById(commentId);
    const commentError = document.getElementById(errorId);
    const comment = commentInput.value.trim();

    if (comment === '' || comment.length < 10 || comment.length > 500) {
        showError(commentInput, commentError, 'Comment should between 10 and 500 characters');
        return false;
    }
    clearFieldError(commentInput, commentError);
    return true;
}

function validateFormFields(nameId, emailId, commentId, nameErrorId, emailErrorId, commentErrorId) {
    const isNameValid = validateNameField(nameId, nameErrorId);
    const isEmailValid = validateEmailField(emailId, emailErrorId);
    const isCommentValid = validateCommentField(commentId, commentErrorId);
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

function clearErrorsForForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input, textarea');
    const errors = form.querySelectorAll('.error-message');
    inputs.forEach(input => input.classList.remove('error'));
    errors.forEach(error => error.textContent = '');
}

// SUBMIT COMMENT
function submitCommentForArticle(nameId, emailId, commentId, commentsArray, commentsListId, totalCommentsId, avgRatingId, formId, ratingDisplayId, charCountId, articleNum) {
    const name = document.getElementById(nameId).value.trim();
    const commentText = document.getElementById(commentId).value.trim();
    const rating = articleNum === 1 ? selectedRating : selectedRating2;

    const comment = {
        id: Date.now(),
        name: name,
        text: commentText,
        rating: rating,
        timestamp: new Date()
    };

    commentsArray.push(comment);
    displayCommentInList(comment, commentsListId);
    updateStatisticsForArticle(commentsArray, totalCommentsId, avgRatingId);
    resetFormForArticle(formId, ratingDisplayId, charCountId, articleNum);
    showSuccessMessage();
}

// DISPLAY COMMENT
function displayCommentInList(comment, commentsListId) {
    const commentsList = document.getElementById(commentsListId);
    const noComments = commentsList.querySelector('.no-comments');
    if (noComments) noComments.remove();

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
    commentsList.insertBefore(commentDiv, commentsList.firstChild);
}

// UPDATE STATISTICS
function updateStatisticsForArticle(commentsArray, totalCommentsId, avgRatingId) {
    const totalCommentsElement = document.getElementById(totalCommentsId);
    const avgRatingElement = document.getElementById(avgRatingId);

    totalCommentsElement.textContent = commentsArray.length;

    const ratingsOnly = commentsArray.filter(c => c.rating > 0);
    if (ratingsOnly.length > 0) {
        const sum = ratingsOnly.reduce((acc, comment) => acc + comment.rating, 0);
        const average = (sum / ratingsOnly.length).toFixed(1);
        avgRatingElement.textContent = average;
    } else {
        avgRatingElement.textContent = '0.0';
    }

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
function resetFormForArticle(formId, ratingDisplayId, charCountId, articleNum) {
    document.getElementById(formId).reset();
    if (articleNum === 1) {
        selectedRating = 0;
    } else {
        selectedRating2 = 0;
    }
    document.getElementById(ratingDisplayId).textContent = 'No rating selected';
    document.getElementById(charCountId).textContent = '0';
    
    const form = document.getElementById(formId);
    const starRatingId = articleNum === 1 ? 'starRating' : 'starRating2';
    highlightStarsForArticle(starRatingId, 0);
    clearErrorsForForm(formId);
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

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
